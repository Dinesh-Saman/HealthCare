import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/sidebar';
import Header from '../Components/navbar';
import axios from 'axios';
import 'jspdf-autotable';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@material-ui/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MenuReportPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3002/menu/get-menu-items');
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items.');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDownload = async () => {
    const doc = new jsPDF('p', 'mm', 'a4'); 
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const startY = 15; 
    
    // Add Letterhead
    doc.setFontSize(22);
    doc.setFont('courier', 'bold');
    doc.setTextColor(75, 0, 130); 
    doc.text("Hotel Breet's Garden", pageWidth / 2, startY, { align: 'center' });
  
    // Subtitle
    doc.setFontSize(17);
    doc.setFont('courier', 'bold');
    doc.setTextColor(0, 128, 0);
    const subtitleY = startY + 7; 
    doc.text('Menu Report', pageWidth / 2, subtitleY, { align: 'center' });
  
    // Address
    doc.setFontSize(12);
    doc.setFont('courier', 'normal');
    doc.setTextColor(0, 0, 255); 
    const addressY = subtitleY + 10; 
    doc.text(' Avissawella-Hatton-Nuwara Eliya Highway, \n20680 Ginigathena, Sri Lanka ', pageWidth / 2, addressY, { align: 'center' });
  
    // Contact
    doc.setFontSize(12);
    doc.setFont('courier', 'normal');
    doc.setTextColor(0, 128, 0);
    const contactY = addressY + 12; 
    doc.text('Contact - 0512 242 020 ', pageWidth / 2, contactY, { align: 'center' });
  
    // Draw a horizontal line below the address
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0); 
    doc.line(margin, addressY + 18, 
             pageWidth - margin, addressY + 18);
  
    // Prepare table data
    const tableColumn = ['Menu Image', 'Menu Item ID', 'Menu Item Name', 'Preparation Time', 'Price', 'Category', 'Serving Size'];
    const tableRows = [];
    
    // Fetch images and prepare table rows
    for (const item of menuItems) {
      try {
        const response = await fetch(item.menuImage);
        if (!response.ok) throw new Error('Image fetch failed');
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        
        tableRows.push([
          imageUrl, 
          item.menuItemId,
          item.menuItemName,
          item.preparationTime,
          item.price,
          item.category,
          item.servingSize
        ]);
      } catch (error) {
        console.error('Error fetching image:', error);
        tableRows.push([
          '', 
          item.menuItemId,
          item.menuItemName,
          item.preparationTime,
          item.price,
          item.category,
          item.servingSize
        ]);
      }
    }
  
    doc.autoTable({
      startY: addressY + 22, 
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
        overflow: 'linebreak',
        cellPadding: 4,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [123, 31, 162], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [255, 255, 255], 
        textColor: [0, 0, 0], 
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
      },
      columnStyles: {
        0: { cellWidth: 32 }, 
      },
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.raw) {
          const imageUrl = data.cell.raw;
          if (imageUrl) {
            const imageHeight = 22; 
            const imageWidth = 30;
            const xPos = data.cell.x + (data.cell.width - imageWidth) / 2; 
            const yPos = data.cell.y + 2; 
  
            data.cell.text = '';
            doc.addImage(imageUrl, 'JPEG', xPos, yPos, imageWidth, imageHeight);
          }
        }
      },
      margin: { top: 0, bottom: 20, left: margin, right: margin },
    });
  
    // Add Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); 
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    }
  
    doc.save('menu_report.pdf');
  };
  
  return (
    <Box>
      <Header />
      <Box display="flex" >
        <Sidebar />
        <Box 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          p={2} 
          style={{ 
            flex: 1, 
            minHeight: '100vh', 
            backgroundColor: 'white', 
            borderRadius: 8, 
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', 
            margin: '15px', 
            position: 'relative',
            marginTop: '15px', 
            marginBottom: '15px',
          }} 
          id="printable-section"
        >
          <Box 
            style={{ 
              textAlign: 'center', 
              marginBottom: '20px', 
              padding: '10px', 
              borderBottom: '2px solid purple', 
              backgroundColor: 'lightblue',
              width: '100%', 
              boxSizing: 'border-box',
            }}>
              <Typography variant="h4" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple' , marginTop:'20px'}}>
                Hotel Breet's Garden
              </Typography>
              <Typography variant="h6" style={{ fontFamily: 'serif', fontStyle: 'bold', color: 'green' }}>
                Menu Report
              </Typography>
              <Typography variant="body1" style={{ fontFamily: 'sans-serif', color: 'grey', marginTop: 10 }}>
                Avissawella-Hatton-Nuwara Eliya Highway, 2 0680 Ginigathena, Sri Lanka 
                <br />
                Contact: 0512 242 020
              </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Menu Image</strong></TableCell>
                  <TableCell><strong>Menu Item ID</strong></TableCell>
                  <TableCell><strong>Menu Item Name</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Preparation Time</strong></TableCell>
                  <TableCell><strong>Serving Size</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.menuItemId}>
                    <TableCell>
                      <img src={item.menuImage} alt={item.menuItemName} style={{ width: '100px', height: 'auto' }} />
                    </TableCell>
                    <TableCell>{item.menuItemId}</TableCell>
                    <TableCell>{item.menuItemName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.preparationTime}</TableCell>
                    <TableCell>{item.servingSize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={4}>
            <Button variant="contained" color="secondary" onClick={handleDownload}>
              Download PDF
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MenuReportPage;
