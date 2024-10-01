import jsPDF from 'jspdf';
import img from '../../assets/images/Black and Gold Luxury  Achievement Certificate (1).png';



const generateCertificate = (courseName:string, tutorName:string) => {
  const validCourseName = courseName || 'Unknown Course';
  const validTutorName = tutorName || 'Unknown Tutor';

  const managerName = 'Sam Saju';
  const authorName = 'Leo Fernandos';
  const completionQuote = `This is to certify the successful completion of ${validCourseName} course`;
  const secondLineQuote = 'the course mentioned above.';

  const pageWidth = 300; 
  const pageHeight = 280; 

  const doc = new jsPDF({
    orientation: 'landscape', 
    unit: 'mm', 
    format: [pageWidth, pageHeight] 
  });

  doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

  doc.setFont('times', 'italic');
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255); 
  doc.text(validTutorName, pageWidth / 2, 155, { align: 'center' });

  doc.setFontSize(30); 
  doc.setTextColor(255, 255, 255); 
  doc.text(validCourseName, pageWidth / 2, 180, { align: 'center' });

  doc.setDrawColor(255, 255, 255); 
  doc.setLineWidth(0.5); 
  doc.line(55, 200, pageWidth - 55, 200); 

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255); 
  doc.setFont('times', 'italic'); 
  doc.setFontSize(14);
  doc.text(completionQuote, pageWidth / 2, 208, { align: 'center' });
  doc.text(secondLineQuote, pageWidth / 2, 216, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255); 
  doc.text(managerName, 70, pageHeight -60);

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255); 
  doc.text(authorName, pageWidth - 65, pageHeight - 60, { align: 'right' });

  doc.save(`${validTutorName}-${validCourseName}.pdf`);
};

export default generateCertificate;
