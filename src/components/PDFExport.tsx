import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { FileDown, Printer, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PDFExportProps {
  title: string;
  filename?: string;
  contentRef: React.RefObject<HTMLElement>;
  onExportStart?: () => void;
  onExportEnd?: () => void;
  className?: string;
}

export const PDFExport: React.FC<PDFExportProps> = ({
  title,
  filename = 'report-nutrizionale',
  contentRef,
  onExportStart,
  onExportEnd,
  className = ''
}) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    if (!contentRef.current || isExporting) return;

    try {
      setIsExporting(true);
      onExportStart?.();
      toast.loading('Generazione PDF in corso...', { id: 'pdf-export' });

      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Aggiungi intestazione
      pdf.setFillColor(16, 185, 129);
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text(title, 105, 12, { align: 'center' });

      // Aggiungi data
      const today = new Date().toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.setFontSize(10);
      pdf.text(`Generato il ${today}`, 105, 18, { align: 'center' });

      // Aggiungi contenuto
      pdf.addImage(imgData, 'PNG', 0, 25, imgWidth, imgHeight);

      // Aggiungi piè di pagina
      const pageCount = pdf.getNumberOfPages();
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(
          'Diet Bilanciamo - Report Nutrizionale',
          105,
          pdf.internal.pageSize.height - 10,
          { align: 'center' }
        );
        pdf.text(
          `Pagina ${i} di ${pageCount}`,
          pdf.internal.pageSize.width - 20,
          pdf.internal.pageSize.height - 10
        );
      }

      // Salva il PDF
      pdf.save(`${filename}.pdf`);
      toast.success('PDF generato con successo!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Errore nella generazione del PDF:', error);
      toast.error('Errore nella generazione del PDF', { id: 'pdf-export' });
    } finally {
      setIsExporting(false);
      onExportEnd?.();
    }
  };

  const handlePrint = async () => {
    if (!contentRef.current || isExporting) return;

    try {
      setIsExporting(true);
      onExportStart?.();
      toast.loading('Preparazione stampa...', { id: 'print' });

      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const printWindow = window.open('');
      if (!printWindow) {
        toast.error('Impossibile aprire la finestra di stampa', { id: 'print' });
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              img { max-width: 100%; height: auto; }
              h1 { color: #10b981; margin-bottom: 5px; }
              .date { color: #6b7280; margin-bottom: 20px; font-size: 14px; }
              .footer { margin-top: 20px; color: #6b7280; font-size: 12px; text-align: center; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="date">Generato il ${new Date().toLocaleDateString('it-IT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
            <img src="${imgData}" />
            <div class="footer">Diet Bilanciamo - Report Nutrizionale</div>
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
      toast.success('Stampa inviata!', { id: 'print' });
    } catch (error) {
      console.error('Errore nella preparazione della stampa:', error);
      toast.error('Errore nella preparazione della stampa', { id: 'print' });
    } finally {
      setIsExporting(false);
      onExportEnd?.();
    }
  };

  const handleShare = async () => {
    if (!contentRef.current || isExporting || !navigator.share) return;

    try {
      setIsExporting(true);
      onExportStart?.();
      toast.loading('Preparazione condivisione...', { id: 'share' });

      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Converti canvas in Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob as Blob), 'image/png', 0.8);
      });

      // Crea file
      const file = new File([blob], `${filename}.png`, { type: 'image/png' });

      // Condividi
      await navigator.share({
        title: title,
        text: 'Ecco il mio report nutrizionale da Diet Bilanciamo!',
        files: [file]
      });

      toast.success('Condivisione completata!', { id: 'share' });
    } catch (error) {
      console.error('Errore nella condivisione:', error);
      if ((error as Error).name !== 'AbortError') {
        toast.error('Errore nella condivisione', { id: 'share' });
      } else {
        toast.error('Condivisione annullata', { id: 'share' });
      }
    } finally {
      setIsExporting(false);
      onExportEnd?.();
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <motion.button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-primary-600 text-white
          hover:bg-primary-700 active:bg-primary-800
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        `}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <FileDown className="w-4 h-4" />
        <span>Esporta PDF</span>
      </motion.button>

      <motion.button
        onClick={handlePrint}
        disabled={isExporting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-gray-600 text-white
          hover:bg-gray-700 active:bg-gray-800
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
        `}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Printer className="w-4 h-4" />
        <span>Stampa</span>
      </motion.button>

      {navigator.share && (
        <motion.button
          onClick={handleShare}
          disabled={isExporting}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-blue-600 text-white
            hover:bg-blue-700 active:bg-blue-800
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          `}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Share2 className="w-4 h-4" />
          <span>Condividi</span>
        </motion.button>
      )}
    </div>
  );
};

// Componente wrapper per rendere più facile l'esportazione
export const ReportContainer: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => {
  const reportRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <PDFExport
          title={title}
          contentRef={reportRef}
          filename={title.toLowerCase().replace(/\s+/g, '-')}
        />
      </div>

      <div
        ref={reportRef}
        className={`
          bg-white dark:bg-gray-800 rounded-xl
          border border-gray-200 dark:border-gray-700
          p-6 shadow-lg ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};