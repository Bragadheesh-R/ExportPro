package com.exportpro.backend.service;

import com.exportpro.backend.model.Order;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.awt.Color;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        try {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 22, Font.BOLD);
            Font headingFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            Paragraph title = new Paragraph("ExportPro", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Used Car Export Invoice", headingFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

            document.add(new Paragraph("Invoice No: INV-" + order.getId(), normalFont));
            document.add(new Paragraph("Order Date: " + order.getCreatedAt().format(formatter), normalFont));
            if (order.getCompletedAt() != null) {
                document.add(new Paragraph("Payment Confirmed: " + order.getCompletedAt().format(formatter), normalFont));
            }
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Bill To:", headingFont));
            document.add(new Paragraph(order.getCustomer().getUsername(), normalFont));
            document.add(new Paragraph(order.getCustomer().getEmail(), normalFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            addTableHeader(table, "Description", "Details");
            addTableRow(table, "Vehicle", order.getCar().getMake() + " " + order.getCar().getModel()
                    + " (" + order.getCar().getYear() + ")");
            addTableRow(table, "VIN", order.getCar().getVin());
            addTableRow(table, "Mileage", order.getCar().getMileage() + " km");
            addTableRow(table, "Condition", order.getCar().getCondition());
            addTableRow(table, "Shipping Port", order.getCar().getShippingPort().getName()
                    + ", " + order.getCar().getShippingPort().getCountry());
            addTableRow(table, "Price Paid", "Rs. " + order.getPriceAtPurchase());

            document.add(table);

            document.add(new Paragraph(" "));
            Paragraph footer = new Paragraph(
                    "Thank you for your purchase with ExportPro. This invoice confirms your order has been completed.",
                    normalFont
            );
            footer.setSpacingBefore(20);
            document.add(footer);

            document.close();
            return out.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }

    private void addTableHeader(PdfPTable table, String col1, String col2) {
        Font font = new Font(Font.HELVETICA, 11, Font.BOLD);
        PdfPCell cell1 = new PdfPCell(new Phrase(col1, font));
        PdfPCell cell2 = new PdfPCell(new Phrase(col2, font));
        cell1.setBackgroundColor(new Color(230, 230, 230));
        cell2.setBackgroundColor(new Color(230, 230, 230));
        table.addCell(cell1);
        table.addCell(cell2);
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        Font labelFont = new Font(Font.HELVETICA, 11, Font.BOLD);
        Font valueFont = new Font(Font.HELVETICA, 11, Font.NORMAL);
        table.addCell(new PdfPCell(new Phrase(label, labelFont)));
        table.addCell(new PdfPCell(new Phrase(value, valueFont)));
    }
}