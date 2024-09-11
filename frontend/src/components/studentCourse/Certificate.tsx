import jsPDF from 'jspdf';
import img from '../../assets/images/Black and Gold Luxury  Achievement Certificate (1).png';

const generateCertificate = (courseName, tutorName) => {
  const managerName = 'Sam Saju';
  const authorName = 'Leo Fernandos';
  const completionQuote = `This is to certify the successful completion of ${courseName} course`; // First line
  const secondLineQuote = 'the course mentioned above.'; // Second line
  
  const doc = new jsPDF();
  
  // Add background image
  doc.addImage(img, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

  // Set font and color for the tutor's name
  doc.setFont('times', 'italic');
    doc.setFontSize(36);
  doc.setTextColor(255, 255, 255); // White color
  doc.text(tutorName, 105, 160, { align: 'center' });

  // Set font and color for the course name
 // Set the font size for course name
doc.setFontSize(30); // Adjust the font size as needed
doc.setTextColor(255, 255, 255); // White color

// Calculate text width
const textWidth = doc.getTextWidth(courseName);

// Original course name text
doc.text(courseName, 105, 195, { align: 'center' });

// Underline the text
doc.setDrawColor(255, 255, 255); // White color for underline
doc.setLineWidth(0.5); // Line thickness
doc.line(105 - textWidth / 2, 200, 105 + textWidth / 2, 200); // Underline position


  // Add quote lines below the course name
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255); // White color for the quote text
  doc.setFont('times', 'italic');  // Use 'times' italic for the quote lines
  doc.setFontSize(14);  // Smaller font size for the quotes
  doc.text(completionQuote, 105, 208, { align: 'center' }); // First line of the quote
  doc.text(secondLineQuote, 105, 216, { align: 'center' }); // Second line of the quote


  // Add Manager's name (left side, near bottom)
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255); // White color
  doc.text(managerName, 45, doc.internal.pageSize.getHeight() - 65); // X=30, Y=bottom - 30

  // Add Author's name (right side, near bottom)
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255); // White color
  doc.text(authorName, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 65, { align: 'right' });

  // Save the PDF
  doc.save(`${tutorName}-${courseName}.pdf`);
};

export default generateCertificate;
