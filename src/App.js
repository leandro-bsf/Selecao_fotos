import React, { useState, useEffect  } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css'



function ImageUploader() {
  const [images, setImages] = useState([]);
  const [name, setName] = useState(''); // Armazena o nome inserido pelo usuário
  const[nome_fotografo , setFotografo] = useState('')
  const [ telefone , setTelefone] = useState('')
  const [Aroba_insta , setAroba_insta] = useState('')
  const [dados_aluno , setDados_aluno] = useState('')
  const [texto_capa , setTexto_capa] = useState('')
  const[Pacote1 , setPacote1] = useState('')
  const[Pacote2 , setPacote2] = useState('')
  const[Pacote3 , setPacote3] = useState('')
  const[Pacote4 , setPacote4] = useState('')
  const[form_pagamento , setForm_pagamento]= useState('')
  const[text_complementar , SetText_complementar] = useState('')
  const [data_entrega , setData_entrega] = useState('')

  const [imageLogo , setImageLogo] = useState(null);

 // Salvar dados no localStorage ao atualizar os estados
 useEffect(() => {
  localStorage.setItem('telefone', telefone);
  localStorage.setItem('Aroba_insta', Aroba_insta);
  localStorage.setItem('texto_capa', texto_capa);
  localStorage.setItem('Pacote1', Pacote1);
  localStorage.setItem('Pacote2', Pacote2);
  localStorage.setItem('Pacote3', Pacote3);
  localStorage.setItem('form_pagamento', form_pagamento);
  localStorage.setItem('text_complementar', text_complementar);
}, [telefone, Aroba_insta, texto_capa, Pacote1, Pacote2, Pacote3, form_pagamento, text_complementar]);

const handleImageLogo = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageLogo(reader.result); // Carrega a imagem como base64
    };
    reader.readAsDataURL(file);
  }
};




  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return; // Se nenhum arquivo foi selecionado, não faz nada.
    }

    const imageList = files.map((file) => ({
      name: file.name,           // Nome do arquivo
      url: URL.createObjectURL(file), // URL da imagem
    }));

    setImages(imageList); // Atualiza o estado com as imagens selecionadas.
  };
  const generatePDF = () => {
    const pageCapa = document.querySelector('.a4-page_capa'); // Seleciona a capa
    const pageContent = document.querySelector('.a4-page'); // Seleciona a página de conteúdo

    const pdf = new jsPDF('portrait', 'px', 'a4'); // Cria o PDF no formato A4

    // Função auxiliar para adicionar uma página ao PDF
    const addPageToPDF = (page, isLastPage) => {
      return html2canvas(page, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        if (!isLastPage) {
          pdf.addPage(); // Adiciona uma nova página ao PDF
        }
      });
    };

    addPageToPDF(pageCapa, false).then(() => {
      addPageToPDF(pageContent, true).then(() => {
        // Usa o valor do input 'dado_aluno' como nome do arquivo PDF
        pdf.save(`${dados_aluno}.pdf`); // Salva o arquivo PDF com o nome do aluno
      });
    });
  }

  return (
    <div  className='div_principal'>

      <div className="header">
      <input   type="text"   placeholder="Informação Aluno "  value={dados_aluno} onChange={(e) => setDados_aluno(e.target.value)}/>
       
         <span> Escola até 30  fotos.</span>
         <br/>
         <input  type="file"  accept="image/*" multiple   onChange={handleImageChange}  />
          <br/>
        <button onClick={generatePDF}>Gerar PDF</button>
      </div>


   

       

      <div className="a4-page">
        <div className='grid_titulo'>
        <span>{dados_aluno}</span>
        <h3>MARQUE  COM X AS FOTOS ESCOLHIDAS</h3>
        {/* {name &&  <h2> {name}</h2>} */}
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