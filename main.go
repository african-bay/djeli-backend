package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
)

// Modèles de données
type Membre struct {
	ID       string  `json:"id"`
	Nom      string  `json:"nom"`
	Plafond  float64 `json:"plafond"`
	Consomme float64 `json:"consomme"`
}

// Simulation de la base de données (In-Memory)
var baseMembres = map[string]Membre{
	"AL-01": {ID: "AL-01", Nom: "Traoré Aminata", Plafond: 5000000, Consomme: 3600000}, // 72%
}

var baremeSante = map[string]float64{
	"CONS_GEN": 10000,
}

func main() {
	r := gin.Default()

	// 1. Tester la santé du système
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Djeli est en ligne"})
	})

	// 2. Rendu de la vérification Patient (Clinique)
	r.GET("/verifier/:id", func(c *gin.Context) {
		id := c.Param("id")
		membre, existe := baseMembres[id]
		if !existe {
			c.JSON(404, gin.H{"erreur": "Membre inconnu"})
			return
		}
		
		// Logique Alerte 70%
		alerte := ""
		if membre.Consomme/membre.Plafond >= 0.7 {
			alerte = "ATTENTION: Seuil de 70% atteint pour ce membre"
		}

		c.JSON(200, gin.H{"membre": membre, "alerte_statut": alerte})
	})

	// 3. Rendu du Contrôle Barème (Médecin de Société)
	r.POST("/analyser-facture", func(c *gin.Context) {
		var req struct {
			CodeActe string  `json:"code_acte"`
			Montant  float64 `json:"montant"`
		}
		c.BindJSON(&req)

		prixBareme := baremeSante[req.CodeActe]
		statut := "APPROUVÉ"
		if req.Montant > prixBareme {
			statut = "SURFACTURATION DÉTECTÉE"
		}

		c.JSON(200, gin.H{
			"statut": statut,
			"prix_negocie": prixBareme,
			"montant_envoye": req.Montant,
			"difference": req.Montant - prixBareme,
		})
	})

	fmt.Println("🚀 Serveur Djeli lancé sur http://localhost:8080")
	r.Run(":8080")
}