export function FlagFire() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>

      {/* ── SVG: Bandeira + Fogo Fotorrealista ── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Filtro de fogo realista — feTurbulence simula a textura irregular */}
          <filter id="fire-real" x="-20%" y="-50%" width="140%" height="200%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.06"
              numOctaves="5"
              seed="3"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="
                3  0  0  0 -0.8
                0  0  0  0  0
                0  0  0  0  0
                0  3  2  0 -1.2
              "
              in="noise"
              result="fireShape"
            />
            <feComposite in="fireShape" in2="fireShape" operator="in" result="fire" />
            <feGaussianBlur stdDeviation="3" in="fire" result="softFire" />
            <feBlend in="softFire" in2="SourceGraphic" mode="screen" result="blend" />
            <feGaussianBlur stdDeviation="0.8" in="blend" />
          </filter>

          {/* Fumaça escura */}
          <filter id="smoke" x="-30%" y="-100%" width="160%" height="250%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.025"
              numOctaves="4"
              seed="7"
              result="smokeNoise"
            />
            <feColorMatrix
              type="matrix"
              values="
                0  0  0  0  0.1
                0  0  0  0  0.1
                0  0  0  0  0.1
                0  2  1  0 -0.8
              "
              in="smokeNoise"
              result="smokeShape"
            />
            <feGaussianBlur stdDeviation="8" in="smokeShape" result="softSmoke" />
            <feBlend in="softSmoke" in2="SourceGraphic" mode="multiply" />
          </filter>

          {/* Calor (distorção térmica) */}
          <filter id="heat" x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02 0.04"
              numOctaves="3"
              seed="11"
              result="heatWave"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="heatWave"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Gradiente da bandeira — mantém cores reais */}
          <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#006B3F" />
            <stop offset="100%" stopColor="#004d2d" />
          </linearGradient>

          {/* Gradiente de fogo fotorrealista */}
          <linearGradient id="fireGrad1" x1="0.3" y1="1" x2="0.7" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#8B0000" stopOpacity="1" />
            <stop offset="12%"  stopColor="#CC2200" stopOpacity="0.95" />
            <stop offset="28%"  stopColor="#FF4400" stopOpacity="0.85" />
            <stop offset="45%"  stopColor="#FF7700" stopOpacity="0.7" />
            <stop offset="62%"  stopColor="#FFAA00" stopOpacity="0.45" />
            <stop offset="78%"  stopColor="#FFDD44" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFF88" stopOpacity="0" />
          </linearGradient>

          {/* Fogo lateral esquerdo */}
          <linearGradient id="fireGrad2" x1="0" y1="1" x2="0.4" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#990000" stopOpacity="0.9" />
            <stop offset="25%"  stopColor="#DD3300" stopOpacity="0.7" />
            <stop offset="55%"  stopColor="#FF6600" stopOpacity="0.4" />
            <stop offset="85%"  stopColor="#FF9900" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFCC00" stopOpacity="0" />
          </linearGradient>

          {/* Vinheta */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="100%" stopColor="#080808" stopOpacity="0.85" />
          </radialGradient>

          {/* Escurecimento topo/baixo */}
          <linearGradient id="topDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#080808" stopOpacity="0.7" />
            <stop offset="30%"  stopColor="transparent" />
            <stop offset="65%"  stopColor="transparent" />
            <stop offset="100%" stopColor="#080808" stopOpacity="0.9" />
          </linearGradient>

          <clipPath id="flagShape">
            <rect x="260" y="140" width="1400" height="800" rx="2" />
          </clipPath>
        </defs>

        {/* ── 1. Fundo escuro geral ── */}
        <rect width="1920" height="1080" fill="#050805" />

        {/* ── 2. Bandeira do Brasil ── */}
        <g clipPath="url(#flagShape)" opacity="0.22" filter="url(#heat)">
          {/* Verde */}
          <rect x="260" y="140" width="1400" height="800" fill="url(#flagGrad)" />
          {/* Losango amarelo */}
          <polygon
            points="960,195 1580,540 960,885 340,540"
            fill="#FFD700"
            opacity="0.95"
          />
          {/* Círculo azul */}
          <ellipse cx="960" cy="540" rx="248" ry="248" fill="#003087" opacity="0.98" />
          {/* Faixa branca diagonal */}
          <path
            d="M 720 495 Q 960 475 1200 495 Q 960 515 720 495 Z"
            fill="white" opacity="0.7" transform="rotate(-6, 960, 495)"
          />
          {/* Estrelas (simplificadas) */}
          {[
            [840,490],[900,520],[960,500],[1020,520],[1080,495],
            [870,555],[940,565],[1010,555],[960,535],
          ].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="white" opacity="0.9" />
          ))}
        </g>

        {/* ── 3. Camada de fogo principal — base da bandeira ── */}
        <g opacity="0.88">
          {/* Fogo central subindo */}
          <path
            d="M 100 1080
               C 200 900, 180 780, 320 620
               C 420 500, 460 380, 500 200
               C 530 80,  560 40,  580 0
               L 620 0
               C 600 60,  580 140, 560 280
               C 530 460, 520 560, 460 680
               C 380 820, 360 900, 300 1080 Z"
            fill="url(#fireGrad2)"
            filter="url(#fire-real)"
            opacity="0.75"
          />

          <path
            d="M 0 1080
               C 80 880, 100 740, 200 560
               C 280 420, 340 300, 380 100
               C 395 30, 400 0, 410 0
               L 460 0
               C 445 30, 430 100, 410 240
               C 370 460, 320 580, 240 740
               C 140 900, 100 960, 0 1080 Z"
            fill="url(#fireGrad1)"
            filter="url(#fire-real)"
            opacity="0.7"
          />

          {/* Núcleo do fogo — mais brilhante e quente */}
          <rect
            x="0" y="600" width="1920" height="480"
            fill="url(#fireGrad1)"
            filter="url(#fire-real)"
            opacity="0.9"
          />

          {/* Fogo direito */}
          <path
            d="M 1920 1080
               C 1820 900, 1800 760, 1680 580
               C 1580 440, 1540 320, 1520 140
               C 1510 60, 1505 20, 1500 0
               L 1460 0
               C 1465 40, 1475 120, 1490 280
               C 1510 480, 1540 600, 1620 760
               C 1720 920, 1780 980, 1920 1080 Z"
            fill="url(#fireGrad2)"
            filter="url(#fire-real)"
            opacity="0.65"
          />

          {/* Base do fogo — laranja intenso */}
          <rect
            x="0" y="820" width="1920" height="260"
            fill="#CC3300"
            opacity="0.55"
            filter="url(#fire-real)"
          />
          <rect
            x="0" y="920" width="1920" height="160"
            fill="#990000"
            opacity="0.7"
          />
        </g>

        {/* ── 4. Fumaça ── */}
        <g opacity="0.35" filter="url(#smoke)">
          <rect x="0" y="0" width="1920" height="500" fill="#111" />
        </g>

        {/* ── 5. Glow laranja/vermelho no centro-baixo ── */}
        <radialGradient id="glowFire" cx="50%" cy="90%" rx="60%" ry="50%">
          <stop offset="0%"   stopColor="#FF4400" stopOpacity="0.25" />
          <stop offset="50%"  stopColor="#FF2200" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <rect width="1920" height="1080" fill="url(#glowFire)" />

        {/* ── 6. Vinheta final ── */}
        <rect width="1920" height="1080" fill="url(#vignette)" />
        <rect width="1920" height="1080" fill="url(#topDark)" />

        {/* ── 7. Escurecimento geral para leitura ── */}
        <rect width="1920" height="1080" fill="#080808" opacity="0.52" />
      </svg>
    </div>
  )
}
