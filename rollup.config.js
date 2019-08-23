import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const babelCfg = require('./babel.config')

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    commonjs(),
    babel({
      babelrc: false,
      ...babelCfg,
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      extensions: ['.js'],
    }),
  ],
}