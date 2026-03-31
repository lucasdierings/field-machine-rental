import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)',
          width: '100%',
          height: '100%',
          padding: '60px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 400,
            height: 400,
            background: 'rgba(74, 222, 128, 0.1)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            background: 'rgba(34, 197, 94, 0.05)',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: '-2px',
            }}
          >
            Field<span style={{ color: '#4ade80' }}>Machine</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: 40,
              fontWeight: 600,
              color: '#d1d5db',
              lineHeight: 1.4,
            }}
          >
            <div>Plataforma de Serviços</div>
            <div>para o Agronegócio</div>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              color: '#9ca3af',
              fontWeight: 400,
              maxWidth: '900px',
              lineHeight: 1.5,
            }}
          >
            Conectamos produtores e prestadores de serviço agrícola no Brasil
          </div>

          {/* Features badges */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              justifyContent: 'center',
              marginTop: '30px',
              fontSize: '24px',
              color: '#86efac',
              fontWeight: 600,
            }}
          >
            <div>- Sem taxas</div>
            <div>- Pagamento direto</div>
            <div>- Avaliações reais</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
