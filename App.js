import React, { useEffect, useState } from 'react';

const API_URL = "https://djeli-backend.onrender.com";

function App() {
  const [salaries, setSalaries] = useState([]);
  const [formData, setFormData] = useState({ nom: '', poste: '', salaire: '' });
  const [loading, setLoading] = useState(true);

  // 1. Charger les données (READ)
  const fetchSalaries = async () => {
    try {
      const res = await fetch(`${API_URL}/salaries`);
      const data = await res.json();
      setSalaries(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    }
  };

  useEffect(() => { fetchSalaries(); }, []);

  // 2. Ajouter un salarié (CREATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/salaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormData({ nom: '', poste: '', salaire: '' }); // Reset formulaire
      fetchSalaries(); // Actualiser la liste
    } catch (err) {
      console.error("Erreur d'ajout:", err);
    }
  };

  // 3. Supprimer un salarié (DELETE)
  const deleteSalarie = async (id) => {
    if (window.confirm("Supprimer ce salarié ?")) {
      try {
        await fetch(`${API_URL}/salaries/${id}`, { method: 'DELETE' });
        fetchSalaries();
      } catch (err) {
        console.error("Erreur de suppression:", err);
      }
    }
  };

  if (loading) return <div style={styles.center}>Connexion au backend...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Système de Gestion Djeli</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          style={styles.input} placeholder="Nom" value={formData.nom}
          onChange={(e) => setFormData({...formData, nom: e.target.value})} required 
        />
        <input 
          style={styles.input} placeholder="Poste" value={formData.poste}
          onChange={(e) => setFormData({...formData, poste: e.target.value})} required 
        />
        <input 
          style={styles.input} type="number" placeholder="Salaire" value={formData.salaire}
          onChange={(e) => setFormData({...formData, salaire: e.target.value})} required 
        />
        <button type="submit" style={styles.buttonAdd}>Ajouter</button>
      </form>

      {/* Tableau des résultats */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Poste</th>
            <th style={styles.th}>Salaire</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((s) => (
            <tr key={s.id} style={styles.tr}>
              <td style={styles.td}>{s.nom}</td>
              <td style={styles.td}>{s.poste}</td>
              <td style={styles.td}>{s.salaire} CFA</td>
              <td style={styles.td}>
                <button onClick={() => deleteSalarie(s.id)} style={styles.buttonDel}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' },
  title: { textAlign: 'center', color: '#2c3e50' },
  form: { display: 'flex', gap: '10px', marginBottom: '30px', background: '#f4f7f6', padding: '20px', borderRadius: '8px' },
  input: { padding: '10px', flex: 1, border: '1px solid #ddd', borderRadius: '4px' },
  buttonAdd: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  buttonDel: { padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', borderBottom: '2px solid #34495e' },
  td: { padding: '15px', borderBottom: '1px solid #eee' },
  center: { textAlign: 'center', marginTop: '100px', fontSize: '20px' }
};

export default App;