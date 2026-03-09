-- ============================================================
-- Monitor Legislativo Conservador — Schema Completo
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- Deputados (populado pelo feeder e seed inicial)
CREATE TABLE IF NOT EXISTS politicians (
  id            INTEGER PRIMARY KEY, -- ID oficial da API da Câmara
  nome          TEXT NOT NULL,
  partido       TEXT,
  estado        TEXT,
  foto_url      TEXT,
  score_atual   DECIMAL(4,2) DEFAULT 0, -- -10.00 a +10.00
  total_votos   INTEGER DEFAULT 0,
  votos_favor   INTEGER DEFAULT 0,  -- votos alinhados com pauta conservadora
  votos_contra  INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Projetos de Lei (populado pelo feeder IA)
CREATE TABLE IF NOT EXISTS bills (
  id              INTEGER PRIMARY KEY, -- ID da API da Câmara
  numero          TEXT NOT NULL,       -- ex: "PL 1234/2024"
  ano             INTEGER,
  ementa_oficial  TEXT,                -- texto original da Câmara
  resumo_ia       TEXT,                -- 2 linhas geradas pelo Claude Haiku
  score_ia        DECIMAL(4,2),        -- nota -10.0 a +10.0 gerada pela IA
  categoria       TEXT DEFAULT 'outro',-- 'imposto'|'familia'|'liberdade'|'outro'
  status          TEXT DEFAULT 'em_tramitacao',
  analisado_em    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT score_range CHECK (score_ia BETWEEN -10 AND 10)
);

-- Votações (relaciona deputado ↔ PL)
CREATE TABLE IF NOT EXISTS votes (
  id              SERIAL PRIMARY KEY,
  politician_id   INTEGER NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  bill_id         INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  voto_apresentado TEXT NOT NULL, -- 'Sim'|'Não'|'Abstenção'|'Obstrução'|'Art. 17'
  data_votacao    DATE NOT NULL,
  UNIQUE(politician_id, bill_id)
);

-- Usuários / Assinantes
CREATE TABLE IF NOT EXISTS users (
  id                      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   TEXT NOT NULL,
  is_premium              BOOLEAN DEFAULT FALSE,
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT,
  subscription_status     TEXT DEFAULT 'free', -- 'free'|'active'|'canceled'|'past_due'
  plan_type               TEXT DEFAULT 'mensal',
  subscribed_at           TIMESTAMPTZ,
  expires_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_politicians_score ON politicians(score_atual DESC);
CREATE INDEX IF NOT EXISTS idx_bills_analisado ON bills(analisado_em DESC);
CREATE INDEX IF NOT EXISTS idx_bills_score ON bills(score_ia);
CREATE INDEX IF NOT EXISTS idx_votes_politician ON votes(politician_id);
CREATE INDEX IF NOT EXISTS idx_votes_bill ON votes(bill_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE politicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politicians: score_atual visível para todos, mas score completo só premium
-- Por simplicidade no MVP: todos podem ver politicians (controle no frontend)
CREATE POLICY "politicians_public_read" ON politicians
  FOR SELECT USING (true);

-- Bills: apenas os 3 mais recentes são públicos; o resto requer premium
CREATE POLICY "bills_public_recent" ON bills
  FOR SELECT USING (true); -- controle granular feito no frontend/API

-- Bills: insert/update apenas pelo service role (feeder)
CREATE POLICY "bills_service_write" ON bills
  FOR ALL USING (auth.role() = 'service_role');

-- Votes: leitura pública
CREATE POLICY "votes_public_read" ON votes
  FOR SELECT USING (true);

CREATE POLICY "votes_service_write" ON votes
  FOR ALL USING (auth.role() = 'service_role');

-- Users: cada usuário vê apenas seu próprio registro
CREATE POLICY "users_own_data" ON users
  FOR ALL USING (auth.uid() = id);

-- Service role pode gerenciar tudo em users (para webhook Stripe)
CREATE POLICY "users_service_manage" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- FUNÇÃO: Recalcular score do deputado após nova votação
-- ============================================================
CREATE OR REPLACE FUNCTION recalculate_politician_score(p_id INTEGER)
RETURNS void AS $$
DECLARE
  v_score DECIMAL(4,2);
  v_total INTEGER;
  v_favor INTEGER;
  v_contra INTEGER;
BEGIN
  -- Calcula média ponderada: voto Sim em PL score positivo = bom
  -- voto Não em PL score negativo = bom (votou contra algo ruim)
  SELECT
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE
      (v.voto_apresentado = 'Sim' AND b.score_ia > 0) OR
      (v.voto_apresentado = 'Não' AND b.score_ia < 0)
    ) as favor,
    COUNT(*) FILTER (WHERE
      (v.voto_apresentado = 'Sim' AND b.score_ia < 0) OR
      (v.voto_apresentado = 'Não' AND b.score_ia > 0)
    ) as contra
  INTO v_total, v_favor, v_contra
  FROM votes v
  JOIN bills b ON b.id = v.bill_id
  WHERE v.politician_id = p_id
    AND b.score_ia IS NOT NULL;

  IF v_total > 0 THEN
    -- Score: de -10 a +10 baseado em % de votos alinhados
    v_score := ((v_favor::DECIMAL / v_total) * 20) - 10;
  ELSE
    v_score := 0;
  END IF;

  UPDATE politicians
  SET
    score_atual = ROUND(v_score, 2),
    total_votos = v_total,
    votos_favor = v_favor,
    votos_contra = v_contra,
    updated_at = NOW()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRIGGER: Recalcula score automaticamente após nova votação
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_recalculate_score()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalculate_politician_score(NEW.politician_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER after_vote_insert
  AFTER INSERT OR UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_score();
