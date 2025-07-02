module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['import'],
  rules: {
    // 🔒 Bloque tous les imports relatifs vers mission-control
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'mission-control',
            message: 'Utilise @mission-control à la place.',
          },
          {
            name: './mission-control/mission-control',
            message: 'Utilise @mission-control à la place.',
          }
        ],
        patterns: [
          '**/mission-control/*',      // attrape tous les imports relatifs vers le dossier
          '**/mission-control/mission-control', // attrape celui que tu fais
          'mission-control',
          'mission-control/*',
        ]
      }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  }
};
