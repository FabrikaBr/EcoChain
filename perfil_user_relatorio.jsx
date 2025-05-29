// components/UserProfile.jsx
import ActivityTimeline from './ActivityTimeline';
import StatsDashboard from './StatsDashboard';

const UserProfile = ({ user }) => {
  // Estatísticas calculadas
  const stats = {
    treesRegistered: user.activities.filter(a => a.type === 'tree_registration').length,
    seedsCollected: user.activities.filter(a => a.type === 'seed_collection')
      .reduce((sum, a) => sum + a.seedAmount, 0),
    plantations: user.activities.filter(a => a.type === 'planting').length,
    visitedLocations: [...new Set(user.activities.map(a => 
      `${a.location.lat.toFixed(4)},${a.location.lng.toFixed(4)}`
    ))].length
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="nft-badge">
          <img src="/icons/nft-badge.png" alt="NFT de Validação" />
          <span>Usuário Verificado</span>
        </div>
        
        <h1>{user.name}</h1>
        <p className="user-id">ID: {user.user_id}</p>
      </header>
      
      <StatsDashboard stats={stats} />
      
      <section className="activity-section">
        <h2>Suas Atividades</h2>
        <ActivityTimeline activities={user.activities} />
      </section>
      
      <section className="comments-section">
        <h2>Observações e Comentários</h2>
        <CommentEditor userId={user.user_id} />
        <CommentList userId={user.user_id} />
      </section>
    </div>
  );
};

// Componente de Estatísticas
const StatsDashboard = ({ stats }) => (
  <div className="stats-dashboard">
    <div className="stat-card">
      <TreeIcon />
      <h3>{stats.treesRegistered}</h3>
      <p>Árvores Registradas</p>
    </div>
    
    <div className="stat-card">
      <SeedIcon />
      <h3>{stats.seedsCollected} kg</h3>
      <p>Sementes Coletadas</p>
    </div>
    
    <div className="stat-card">
      <PlantIcon />
      <h3>{stats.plantations}</h3>
      <p>Mudas Plantadas</p>
    </div>
    
    <div className="stat-card">
      <LocationIcon />
      <h3>{stats.visitedLocations}</h3>
      <p>Locais Visitados</p>
    </div>
  </div>
);