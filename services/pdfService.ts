
import { jsPDF } from 'jspdf';
import { TravelPassRequest, User } from '../types';

export const generatePassPDF = (request: TravelPassRequest, user: User) => {
  const doc = new jsPDF();
  
  // Background/Border
  doc.setDrawColor(30, 58, 138); // Navy Blue
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 120);
  
  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(10, 10, 190, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('SMART PASS SYSTEM', 105, 27, { align: 'center' });
  
  // Content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TRAVEL PASS IDENTIFICATION', 105, 45, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`PASS ID: ${request.uniqueCode}`, 20, 55);
  doc.text(`ISSUED DATE: ${new Date().toLocaleDateString()}`, 130, 55);
  
  doc.line(20, 60, 190, 60);
  
  // Student Info Table Style
  const startY = 70;
  const lineSpacing = 10;
  
  doc.text('Student Name:', 20, startY);
  doc.setFont('helvetica', 'bold');
  doc.text(user.name, 60, startY);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Institution ID:', 20, startY + lineSpacing);
  doc.setFont('helvetica', 'bold');
  doc.text(user.institutionId, 60, startY + lineSpacing);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Travel Type:', 20, startY + (lineSpacing * 2));
  doc.setFont('helvetica', 'bold');
  doc.text(`${request.passType} PASS`, 60, startY + (lineSpacing * 2));
  
  doc.setFont('helvetica', 'normal');
  doc.text('Route:', 20, startY + (lineSpacing * 3));
  doc.setFont('helvetica', 'bold');
  doc.text(`${request.source} -> ${request.destination}`, 60, startY + (lineSpacing * 3));
  
  doc.setFont('helvetica', 'normal');
  doc.text('Valid Up To:', 20, startY + (lineSpacing * 4));
  doc.setFont('helvetica', 'bold');
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + request.durationMonths);
  doc.text(expiryDate.toLocaleDateString(), 60, startY + (lineSpacing * 4));
  
  // Digital Sign Placeholder
  doc.setDrawColor(200);
  doc.rect(140, 75, 40, 30);
  doc.setFontSize(8);
  doc.text('DIGITAL SEAL', 160, 85, { align: 'center' });
  doc.text(request.uniqueCode || '', 160, 95, { align: 'center' });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('This is a digitally generated travel pass. It must be presented along with a valid Student ID card.', 105, 125, { align: 'center' });

  doc.save(`${user.name}_SmartPass_${request.passType}.pdf`);
};
