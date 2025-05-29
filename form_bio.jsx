// src/App.js
import React from 'react';
import PlantRegistrationForm from './components/PlantRegistrationForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <div className="leaf"></div>
            <div className="dna"></div>
          </div>
          <h1>BioGermina</h1>
          <p>Rastreabilidade Genética</p>
        </div>
      </header>
      
      <main className="main-content">
        <div className="form-container">
          <h2>Registrar Nova Árvore</h2>
          <p className="subtitle">Preencha os dados para registro e rastreabilidade no blockchain</p>
          
          <PlantRegistrationForm />
        </div>
        
        <div className="info-panel">
          <div className="info-card">
            <h3>Por que registrar?</h3>
            <ul>
              <li>Rastreabilidade das sementes</li>
              <li>Preservação genética</li>
              <li>Valorização do coletor</li>
              <li>Comercialização transparente</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Como funciona?</h3>
            <ol>
              <li>Registre a árvore com localização</li>
              <li>Coleta as sementes na época certa</li>
              <li>Venda com certificação blockchain</li>
              <li>Acompanhe todo o ciclo</li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2023 BioGermina - Parceria Embrapa e FabrikaBr</p>
        <p>Tecnologia para preservação ecológica e cultural</p>
      </footer>
    </div>
  );
}

export default App;