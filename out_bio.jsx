// src/components/PlantRegistrationForm.jsx
import React, { useState, useEffect } from 'react';

const PlantRegistrationForm = () => {
  // Estados para os dados do formulário
  const [formData, setFormData] = useState({
    species: '',
    height: '',
    diameter: '',
    seedEstimate: '',
    season: '',
    observations: '',
    photos: []
  });
  
  // Estados para a localização
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    error: null
  });
  
  // Estado para o envio do formulário
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Opções para os selects
  const speciesOptions = [
    'Araucária (Araucaria angustifolia)',
    'Ipê Amarelo (Handroanthus albus)',
    'Pinhão Bravo (Podocarpus lambertii)',
    'Cedro (Cedrela fissilis)',
    'Outra espécie'
  ];
  
  const seasonOptions = [
    'Verão (Dez-Mar)',
    'Outono (Mar-Jun)',
    'Inverno (Jun-Set)',
    'Primavera (Set-Dez)'
  ];

  // Capturar localização ao carregar o componente
  useEffect(() => {
    captureLocation();
  }, []);

  // Função para capturar a localização
  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            error: null
          });
        },
        (error) => {
          setLocation({
            ...location,
            error: `Erro na geolocalização: ${error.message}`
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocation({
        ...location,
        error: "Geolocalização não suportada pelo navegador"
      });
    }
  };

  // Manipulador de mudança de inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manipulador de upload de fotos
  const handlePhotoUpload = (e) => {
    if (e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).slice(0, 3); // Limitar a 3 fotos
      setFormData({
        ...formData,
        photos: filesArray
      });
    }
  };

  // Enviar formulário para o Netlify
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Criar FormData para enviar arquivos
      const netlifyFormData = new FormData();
      
      // Adicionar dados do formulário
      netlifyFormData.append('form-name', 'plant-registration');
      netlifyFormData.append('species', formData.species);
      netlifyFormData.append('height', formData.height);
      netlifyFormData.append('diameter', formData.diameter);
      netlifyFormData.append('seedEstimate', formData.seedEstimate);
      netlifyFormData.append('season', formData.season);
      netlifyFormData.append('observations', formData.observations);
      netlifyFormData.append('latitude', location.lat);
      netlifyFormData.append('longitude', location.lng);
      netlifyFormData.append('accuracy', location.accuracy);
      
      // Adicionar fotos
      formData.photos.forEach((photo, index) => {
        netlifyFormData.append(`photo-${index}`, photo);
      });
      
      // Enviar para o Netlify
      const response = await fetch('/', {
        method: 'POST',
        body: netlifyFormData,
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        // Resetar formulário após sucesso
        setFormData({
          species: '',
          height: '',
          diameter: '',
          seedEstimate: '',
          season: '',
          observations: '',
          photos: []
        });
      } else {
        throw new Error('Erro no envio do formulário');
      }
    } catch (error) {
      setSubmitError(error.message || 'Ocorreu um erro ao enviar o formulário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      name="plant-registration" 
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      {/* Campo oculto para o Netlify */}
      <input type="hidden" name="form-name" value="plant-registration" />
      
      {/* Seção de Localização */}
      <div className="form-section">
        <h3>Localização da Árvore</h3>
        
        <div className="location-container">
          {location.error ? (
            <div className="error-message">
              <p>{location.error}</p>
              <button type="button" onClick={captureLocation} className="retry-btn">
                Tentar Novamente
              </button>
            </div>
          ) : location.lat ? (
            <div className="location-success">
              <p>📍 Localização capturada com sucesso!</p>
              <p className="coordinates">
                Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
              </p>
              <p className="accuracy">Precisão: {Math.round(location.accuracy)} metros</p>
            </div>
          ) : (
            <div className="location-loading">
              <p>Capturando localização...</p>
              <div className="spinner"></div>
            </div>
          )}
          
          <button 
            type="button" 
            onClick={captureLocation}
            className="location-btn"
            disabled={isSubmitting}
          >
            {location.lat ? 'Atualizar Localização' : 'Capturar Localização'}
          </button>
        </div>
      </div>
      
      {/* Seção de Dados da Árvore */}
      <div className="form-section">
        <h3>Dados da Árvore</h3>
        
        <div className="form-group">
          <label htmlFor="species">Espécie *</label>
          <select
            id="species"
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione uma espécie</option>
            {speciesOptions.map((species, index) => (
              <option key={index} value={species}>{species}</option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">Altura aproximada (metros)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              min="1"
              max="50"
              step="0.5"
              placeholder="Ex: 15.5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="diameter">Diâmetro do tronco (cm)</label>
            <input
              type="number"
              id="diameter"
              name="diameter"
              value={formData.diameter}
              onChange={handleInputChange}
              min="10"
              max="300"
              step="5"
              placeholder="Ex: 80"
            />
          </div>
        </div>
      </div>
      
      {/* Seção de Sementes */}
      <div className="form-section">
        <h3>Informações sobre Sementes</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="seedEstimate">Estimativa de sementes (kg/ano) *</label>
            <input
              type="number"
              id="seedEstimate"
              name="seedEstimate"
              value={formData.seedEstimate}
              onChange={handleInputChange}
              min="1"
              max="1000"
              required
              placeholder="Ex: 50"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="season">Melhor época para coleta *</label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione a época</option>
              {seasonOptions.map((season, index) => (
                <option key={index} value={season}>{season}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Seção de Fotos */}
      <div className="form-section">
        <h3>Registro Fotográfico</h3>
        <p className="photo-instructions">Adicione até 3 fotos da árvore (obrigatório pelo menos 1)</p>
        
        <div className="form-group">
          <label htmlFor="photos">Fotos da Árvore *</label>
          <input
            type="file"
            id="photos"
            name="photos"
            onChange={handlePhotoUpload}
            accept="image/*"
            multiple
            required
          />
          
          {formData.photos.length > 0 && (
            <div className="photo-preview">
              <p>Fotos selecionadas:</p>
              <ul>
                {formData.photos.map((photo, index) => (
                  <li key={index}>{photo.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Observações */}
      <div className="form-section">
        <h3>Observações Adicionais</h3>
        <div className="form-group">
          <label htmlFor="observations">Detalhes sobre a árvore ou localização</label>
          <textarea
            id="observations"
            name="observations"
            value={formData.observations}
            onChange={handleInputChange}
            rows="4"
            placeholder="Ex: Árvore com sinais de doença, próximo a rio, etc."
          ></textarea>
        </div>
      </div>
      
      {/* Blockchain Info */}
      <div className="blockchain-info">
        <div className="blockchain-icon">⛓️</div>
        <p>
          Este registro será armazenado em blockchain para garantir a rastreabilidade 
          e autenticidade das informações
        </p>
      </div>
      
      {/* Mensagens de envio */}
      {submitSuccess && (
        <div className="success-message">
          <h3>✅ Registro enviado com sucesso!</h3>
          <p>Sua árvore foi registrada no sistema e será adicionada ao blockchain em breve.</p>
        </div>
      )}
      
      {submitError && (
        <div className="error-message">
          <h3>❌ Erro no envio</h3>
          <p>{submitError}</p>
        </div>
      )}
      
      {/* Botão de envio */}
      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting || !location.lat}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span> Registrando no blockchain...
          </>
        ) : (
          'Registrar Árvore'
        )}
      </button>
      
      <p className="form-note">
        * Campos obrigatórios. Os dados serão usados para rastreabilidade genética e 
        certificação de origem através de tecnologia blockchain.
      </p>
    </form>
  );
};

export default PlantRegistrationForm;