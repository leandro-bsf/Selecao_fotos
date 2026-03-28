import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

function ImageUploader() {
  const [images, setImages] = useState([]);
  const [dadosAluno, setDadosAluno] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  // Upload das imagens do grid
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const imageList = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages(imageList);
  };

  // Upload da capa
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };

  // Geração do PDF
  const generatePDF = async () => {
    const pageContent = document.querySelector('.a4-page');

    if (!pageContent) {
      alert('Erro ao gerar o PDF: conteúdo não encontrado.');
      return;
    }

    const pdf = new jsPDF('portrait', 'px', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    try {
      // ✅ PAGINA 1 - CAPA
      if (coverImage) {
        const img = new Image();
        img.src = coverImage.url;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.addPage();
      }

      // ✅ PAGINA 2 - GRID
      const canvas = await html2canvas(pageContent, { scale: 2 });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);

      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

      pdf.save(`${dadosAluno || 'document'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
      alert('Erro ao gerar o PDF.');
    }
  };

  return (
    <div className="div_principal">
      <div className="header">
        <div className="Form">
          <span>Preencha os Dados abaixo para criação da Capa</span> <br />
          <input
            type="text"
            placeholder="Informação do Aluno"
            value={dadosAluno}
            onChange={(e) => setDadosAluno(e.target.value)}
          />
        </div>

        {/* Upload da CAPA */}
        <div className="Form">
          <span>Imagem da Capa (Página 1)</span>
          <input type="file" accept="image/*" onChange={handleCoverChange} />
        </div>

        {/* Upload das fotos */}
        <div className="Form">
          <br />
          <span>Escolha até 30 fotos.</span>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <br />
          <button onClick={generatePDF}>Gerar PDF</button>
        </div>
      </div>
      {coverImage && (
  <div className="a4-page-cover">
    <img src={coverImage.url} alt="Capa" />

    <div className="cover-overlay">
      <h1>{dadosAluno}</h1>
    </div>
  </div>
)}
      {/* Página do GRID */}
      <div className="a4-page">
        <div className="grid_titulo">
          <span>{dadosAluno}</span>
          <h3>MARQUE COM X AS FOTOS ESCOLHIDAS</h3>
        </div>

        {images.length > 0 ? (
          <div className="image-grid">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <p>{image.name}</p>
                <div className="small-square"></div>
                <img src={image.url} alt={image.name} />
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma imagem selecionada</p>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;