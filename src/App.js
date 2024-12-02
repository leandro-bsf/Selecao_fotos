import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

function ImageUploader() {
  const [images, setImages] = useState([]);
  const [dadosAluno, setDadosAluno] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return; // Se nenhum arquivo foi selecionado, não faz nada.

    const imageList = files.map((file) => ({
      name: file.name, // Nome do arquivo
      url: URL.createObjectURL(file), // URL da imagem
    }));

    setImages(imageList); // Atualiza o estado com as imagens selecionadas.
  };

  const generatePDF = () => {
    const pageContent = document.querySelector('.a4-page'); // Seleciona o conteúdo para o PDF

    if (!pageContent) {
      console.error("Elemento '.a4-page' não encontrado no DOM!");
      alert('Erro ao gerar o PDF: elemento não encontrado.');
      return;
    }

    const pdf = new jsPDF('portrait', 'px', 'a4'); // Cria o PDF no formato A4

    html2canvas(pageContent, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${dadosAluno || 'document'}.pdf`); // Usa o nome ou um padrão
      })
      .catch((error) => {
        console.error('Erro ao gerar o PDF:', error);
        alert('Erro ao gerar o PDF. Confira o console para mais detalhes.');
      });
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

        <div className="Form">
          <br />
          <span>Escolha até 30 fotos.</span>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <br />
          <button onClick={generatePDF}>Gerar PDF</button>
        </div>
      </div>

      <div className="a4-page">
        <div className="grid_titulo">
          <span>{dadosAluno}</span>
          <h3>MARQUE COM X AS FOTOS ESCOLHIDAS</h3>
        </div>

        {images.length > 0 ? (
          <div className="image-grid">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <p>{image.name}</p> {/* Nome do arquivo */}
                <div className="small-square"></div> {/* Quadrado pequeno */}
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
