export class Madj {
  board: string[][];
  size: number;
  xScore: number;
  oScore: number;
  nombreDePionsPourVictoire: number;

  constructor(size: number, nombreDePionsPourVictoire: number) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(""));
    this.xScore = 0;
    this.oScore = 0;
    this.nombreDePionsPourVictoire = nombreDePionsPourVictoire;
    this.initializePredefinedPositions();
  }

  initializePredefinedPositions() {
    const center = Math.floor(this.size / 2);

    // Assurez-vous que la taille du plateau permet de placer les marques sans sortir du tableau
    if (this.size > center +1) {
      this.board[center][center] = 'X';
      this.board[center - 1][center - 1] = 'X';
      this.board[center - 1][center] = 'O';
      this.board[center][center - 1] = 'O';
    }
  }

  placeMark(row: number, col: number, mark: string): boolean {
    if (
      row < 0 ||
      row >= this.size ||
      col < 0 ||
      col >= this.size ||
      this.board[row][col] !== "" ||
      !this.isAdjacentToMark(row, col)
    ) {
      return false; // Mouvement invalide
    }
    this.board[row][col] = mark;
    // Mettre à jour les scores et vérifier les conditions de fin de partie
    this.updateScores();
    return true;
  }
  
  isAdjacentToMark(row: number, col: number): boolean {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], /* [0, 0], */ [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (
        newRow >= 0 && newRow < this.size &&
        newCol >= 0 && newCol < this.size &&
        this.board[newRow][newCol] !== ""
      ) {
        return true; // Il y a un pion adjacent
      }
    }
    return false; // Aucun pion adjacent trouvé
  }
  

  updateScores() {
    // Réinitialiser les scores avant de recompter
    this.xScore = 0;
    this.oScore = 0;
  
    // Mettre à jour les scores en vérifiant les alignements dans les lignes, colonnes et diagonales
    for (let i = 0; i < this.size; i++) {
      if (this.alignementConsecutif("x", [i, 0], [0, 1])) {
        this.xScore++; // Alignement consécutif de croix dans une ligne
      }
      if (this.alignementConsecutif("o", [i, 0], [0, 1])) {
        this.oScore++; // Alignement consécutif de ronds dans une ligne
      }
      if (this.alignementConsecutif("x", [0, i], [1, 0])) {
        this.xScore++; // Alignement consécutif de croix dans une colonne
      }
      if (this.alignementConsecutif("o", [0, i], [1, 0])) {
        this.oScore++; // Alignement consécutif de ronds dans une colonne
      }
    }
    if (this.alignementConsecutif("x", [0, 0], [1, 1])) {
      this.xScore++; // Alignement consécutif de croix dans la diagonale principale
    }
    if (this.alignementConsecutif("o", [0, 0], [1, 1])) {
      this.oScore++; // Alignement consécutif de ronds dans la diagonale principale
    }
    if (this.alignementConsecutif("x", [0, this.size - 1], [1, -1])) {
      this.xScore++; // Alignement consécutif de croix dans la diagonale secondaire
    }
    if (this.alignementConsecutif("o", [0, this.size - 1], [1, -1])) {
      this.oScore++; // Alignement consécutif de ronds dans la diagonale secondaire
    }
  }
  

  isGameOver(): boolean {
    if (this.isFull() && this.xScore === this.oScore) {
      return true; // Match nul
    }
    // Vérifier d'autres conditions de fin de partie (victoire par alignement, etc.)
    if (this.detectionVictoire("x") || this.detectionVictoire("o")) {
      return true; // Victoire détectée
    }
    return false; // Le jeu n'est pas terminé
  }

  isFull(): boolean {
    for (const row of this.board) {
      if (row.includes("")) {
        return false; // Le plateau n'est pas plein
      }
    }
    return true; // Le plateau est plein
  }

  detectionVictoire(joueur: string): boolean {
    for (let i = 0; i < this.size; i++) {
      if (this.alignementConsecutif(joueur, [i, 0], [0, 1])) {
        return true; // Victoire dans une ligne
      }
      if (this.alignementConsecutif(joueur, [0, i], [1, 0])) {
        return true; // Victoire dans une colonne
      }
    }
    if (this.alignementConsecutif(joueur, [0, 0], [1, 1])) {
      return true; // Victoire dans la diagonale principale
    }
    if (this.alignementConsecutif(joueur, [0, this.size - 1], [1, -1])) {
      return true; // Victoire dans la diagonale secondaire
    }
    return false; // Aucune victoire détectée
  }

  alignementConsecutif(
    joueur: string,
    position: [number, number],
    direction: [number, number]
  ): boolean {
    let [x, y] = position;
    const [dx, dy] = direction;
    let compteur = 0;
    while (x >= 0 && x < this.size && y >= 0 && y < this.size) {
      if (this.board[x][y] === joueur) {
        compteur++;
        if (compteur >= this.nombreDePionsPourVictoire) {
          return true; // Alignement consécutif détecté
        }
      } else {
        compteur = 0;
      }
      x += dx;
      y += dy;
    }
    return false; // Aucun alignement consécutif détecté
  }

  diagonalePrincipale(): string[] {
    const diagonale = [];
    for (let i = 0; i < this.size; i++) {
      diagonale.push(this.board[i][i]);
    }
    return diagonale;
  }

  diagonaleSecondaire(): string[] {
    const diagonale = [];
    for (let i = 0; i < this.size; i++) {
      diagonale.push(this.board[i][this.size - 1 - i]);
    }
    return diagonale;
  }

  detectionMatchNul(): boolean {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell === "") {
          return false; // Il reste au moins une case vide
        }
      }
    }
    return true; // Toutes les cases sont remplies
  }

  mouvementValide(joueur: string, position: [number, number]): boolean {
    const [row, col] = position;
    if (
      row < 0 ||
      row >= this.size ||
      col < 0 ||
      col >= this.size ||
      this.board[row][col] !== ""
    ) {
      return false; // Mouvement invalide
    }
    // Vérifier si un pion du joueur est adjacent à la position
    for (
      let i = Math.max(0, row - 1);
      i <= Math.min(this.size - 1, row + 1);
      i++
    ) {
      for (
        let j = Math.max(0, col - 1);
        j <= Math.min(this.size - 1, col + 1);
        j++
      ) {
        if (this.board[i][j] === joueur) {
          return true; // Un pion du joueur est adjacent à la position
        }
      }
    }
    return false; // Aucun pion du joueur est adjacent à la position
  }

  detectionAlignementCoins(joueur: string): boolean {
    const corners: {
      position: [number, number];
      direction: [number, number];
    }[] = [
      { position: [0, 0], direction: [1, 1] }, // Coin supérieur gauche
      { position: [0, this.size - 1], direction: [1, -1] }, // Coin supérieur droit
      { position: [this.size - 1, 0], direction: [-1, 1] }, // Coin inférieur gauche
      { position: [this.size - 1, this.size - 1], direction: [-1, -1] }, // Coin inférieur droit
    ];
    for (const corner of corners) {
      if (
        this.alignementConsecutif(joueur, corner.position, corner.direction)
      ) {
        return true; // Alignement dans un coin détecté
      }
    }
    return false; // Aucun alignement dans les coins détecté
  }

  detectionAlignementCarreOuRectangle(
    joueur: string,
    plateau: string[][]
  ): boolean {
    const k = this.nombreDePionsPourVictoire;
    // Vérification des lignes horizontales
    for (let i = 0; i < plateau.length; i++) {
      for (let j = 0; j <= plateau[i].length - k; j++) {
        if (this.alignementConsecutif(joueur, [i, j], [0, 1])) {
          return true; // Alignement horizontal détecté
        }
      }
    }
    // Vérification des colonnes verticales
    for (let i = 0; i < plateau[0].length; i++) {
      for (let j = 0; j <= plateau.length - k; j++) {
        if (this.alignementConsecutif(joueur, [j, i], [1, 0])) {
          return true; // Alignement vertical détecté
        }
      }
    }
    // Ajoutez ici les vérifications pour les diagonales si nécessaire
    return false; // Aucun alignement formant un carré ou un rectangle détecté
  }

  detectionAlignementCroix(joueur: string, plateau: string[][]): boolean {
    for (const row of plateau) {
      if (this.alignementCroix(joueur, row)) {
        return true; // Alignement en formant une croix dans une ligne
      }
    }
    for (let i = 0; i < plateau[0].length; i++) {
      const col = plateau.map((row) => row[i]);
      if (this.alignementCroix(joueur, col)) {
        return true; // Alignement en formant une croix dans une colonne
      }
    }
    return false; // Aucun alignement en formant une croix détecté
  }

  detectionAlignementT(joueur: string, plateau: string[][]): boolean {
    for (const row of plateau) {
      if (this.alignementT(joueur, row)) {
        return true; // Alignement en formant un T dans une ligne
      }
    }
    for (let i = 0; i < plateau[0].length; i++) {
      const col = plateau.map((row) => row[i]);
      if (this.alignementT(joueur, col)) {
        return true; // Alignement en formant un T dans une colonne
      }
    }
    return false; // Aucun alignement en formant un T détecté
  }

  alignementCroix(joueur: string, ligneOuColonne: string[]): boolean {
    const taillePlateau = ligneOuColonne.length;
    for (let i = 0; i < taillePlateau; i++) {
      if (ligneOuColonne[i] === joueur) {
        if (
          (i > 0 && ligneOuColonne[i - 1] === joueur) ||
          (i < taillePlateau - 1 && ligneOuColonne[i + 1] === joueur)
        ) {
          return true;
        }
      }
      if (ligneOuColonne[taillePlateau - 1 - i] === joueur) {
        if (
          (i > 0 && ligneOuColonne[taillePlateau - i] === joueur) ||
          (i < taillePlateau - 1 &&
            ligneOuColonne[taillePlateau - i - 2] === joueur)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  alignementT(joueur: string, ligneOuColonne: string[]): boolean {
    const taillePlateau = ligneOuColonne.length;
    for (let i = 0; i < taillePlateau; i++) {
      if (ligneOuColonne[i] === joueur) {
        if (
          (i > 0 && ligneOuColonne[i - 1] === joueur) ||
          (i < taillePlateau - 1 && ligneOuColonne[i + 1] === joueur)
        ) {
          return true;
        }
      }
      if (ligneOuColonne[taillePlateau - 1] === joueur) {
        if (
          (i > 0 && ligneOuColonne[i] === joueur) ||
          (i < taillePlateau - 1 && ligneOuColonne[i] === joueur)
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
