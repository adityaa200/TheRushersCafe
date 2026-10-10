'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, QrCode as QrIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function QRSection() {
  const [showDownload, setShowDownload] = useState(false);
  const menuUrl = typeof window !== 'undefined' ? `${window.location.origin}/menu` : '';

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 500;
      if (!ctx) return;
      ctx.fillStyle = '#0D0D0D';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#C9A227';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText('The Rushers Cafe', canvas.width / 2, 40);
      ctx.fillStyle = '#A8A29E';
      ctx.font = '12px sans-serif';
      ctx.fillText('SCAN TO VIEW MENU', canvas.width / 2, 60);
      const qrSize = 280;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 80;
      ctx.fillStyle = '#F5F1E8';
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#C9A227';
      ctx.font = '12px sans-serif';
      ctx.fillText('therusherscafe.com', canvas.width / 2, 380);
      ctx.fillStyle = '#A8A29E';
      ctx.font = '10px sans-serif';
      ctx.fillText('Crafted with passion. Served with soul.', canvas.width / 2, 400);

      const link = document.createElement('a');
      link.download = 'the-rushers-cafe-qr-menu.png';
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    setShowDownload(true);
    setTimeout(() => setShowDownload(false), 3000);
  };

  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
        >
          {/* QR Code Card */}
          <div className="flex flex-col items-center">
            <div className="relative border border-border bg-card p-8">
              <p className="mb-2 text-center font-serif text-lg font-bold text-foreground">The Rushers Cafe</p>
              <p className="mb-6 text-center text-[10px] tracking-widest text-gold">SCAN TO VIEW MENU</p>
              <div className="flex items-center justify-center bg-foreground/95 p-4">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={menuUrl || 'https://therusherscafe.com/menu'}
                  size={200}
                  bgColor="#F5F1E8"
                  fgColor="#0D0D0D"
                  level="M"
                />
              </div>
              <p className="mt-4 text-center text-[10px] tracking-wider text-muted-foreground">
                therusherscafe.com/menu
              </p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">DIGITAL MENU</p>
            <h2 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
              SCAN.
              <br />
              ORDER.
              <br />
              <span className="text-gold">ENJOY.</span>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Scan the QR code to instantly access our full digital menu on your phone.
              No app needed — just point your camera and tap.
            </p>
            <div className="mt-8">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 border border-gold bg-gold px-6 py-3 text-xs font-semibold tracking-widest text-primary-foreground transition-all hover:bg-transparent hover:text-gold"
              >
                <Download className="h-4 w-4" /> DOWNLOAD QR CODE
              </button>
              <AnimatePresence>
                {showDownload && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-xs text-gold"
                  >
                    QR code downloaded! Print and display at your tables.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <QrIcon className="h-4 w-4 text-gold" />
              <span>Printable QR card for your tables</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
