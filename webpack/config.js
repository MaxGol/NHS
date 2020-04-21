const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackHTMLPlugin = require('html-webpack-plugin')
const yaml = require('node-yaml')

const CWD = process.cwd()
const BUILD = path.resolve(CWD, 'build/client')
const SRC = path.resolve(CWD, 'src/client')
const COMMON = path.resolve(CWD, 'src/common')
const PRODUCTION = process.env.NODE_ENV === 'production'
const SERVERLESS = yaml.readSync(path.resolve(CWD, 'serverless.yml'))
const STAGE = process.env.STAGE || 'development'
const ENV = yaml.readSync(path.resolve(CWD, 'env.yml'))
const devJSServerModules = PRODUCTION ? [] : ['react-hot-loader/patch']

const plugins = [
  new webpack.EnvironmentPlugin({
    STAGE: STAGE,
    SERVICE: SERVERLESS.service,
    DB_HOST: ENV[`${STAGE}`].DB_HOST,
    DB_USER: ENV[`${STAGE}`].DB_USER,
    DB_PASSWORD: ENV[`${STAGE}`].DB_PASSWORD,
    DB_DATABASE: ENV[`${STAGE}`].DB_PASSWORD,
    DB_PORT: ENV[`${STAGE}`].DB_PORT,
    GRAPHQL_ENDPOINT: ENV[`${STAGE}`].GRAPHQL_ENDPOINT
  })
]

if (PRODUCTION) {
  plugins.unshift(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      ignoreOrder: false
    })
  )
} else {
  plugins.unshift(
    new webpack.HotModuleReplacementPlugin()
  )
}

const cssModules =
  [
    [/src\/client\/js/, true, /\.scss$/, 'sass'],
    [/src\/client\/scss/, false, /\.scss$/, 'sass'],
    [/src\/common\/styles/, false, /\.scss$/, 'sass'],
    [/node_modules/, false, /\.scss$/, 'sass'],
    [/node_modules/, false, /\.css$/, 'css']
  ].map(([include, modules, test, loader]) => {
    const config = {
      use: [{
        loader: 'css-loader',
        options: {
          modules,
          sourceMap: !PRODUCTION
        }
      }]
    }

    const preprocessors = [{
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        plugins: (loader) => [
          require('postcss-cssnext')()
        ]
      }
    }, 'resolve-url-loader', {
      loader: `${loader}-loader`,
      options: {
        sourceMap: true
      }
    }]

    if (!PRODUCTION) {
      config.use.unshift('style-loader')
    }

    if (loader !== 'css') {
      config.use.push(...preprocessors)
    }

    return {
      include,
      test,
      use: PRODUCTION ? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] : config.use
    }
  })

module.exports = (path, i) => {
  return {
    context: SRC,
    entry: {
      app: [
        ...devJSServerModules,
        'babel-polyfill',
        `./${path}/js/app`,
        'semantic-ui-css/semantic.min.css',
        `${COMMON}/styles/${path}/app`
      ]
    },
    devtool: PRODUCTION ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'image/png',
                name: 'images/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.eot(\?v=\d+.\d+.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'application/font-woff',
                name: 'fonts/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'application/octet-stream',
                name: 'fonts/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                mimetype: 'image/svg+xml',
                name: 'images/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.json$/,
          exclude: /node_modules/,
          use: ['json-loader']
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              plugins: PRODUCTION ? [require('babel-plugin-transform-remove-console')] : undefined
            }
          }]
        },
        {
          test: /\.yml$/,
          use: ['json-loader', 'yaml-loader']
        }].concat(cssModules)
    },
    output: {
      filename: '[name].[hash].js',
      path: `${BUILD}/${path}/`,
      publicPath: '/'
    },
    mode: PRODUCTION ? 'production' : 'development',
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: (module) => {
              if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                return false
              }
              return module.context && module.context.indexOf('node_modules') !== -1
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        base: process.cwd(),
        schema: `${SRC}/schema`,
        helper: `${SRC}/helper`,
        common: `${COMMON}`
      },
      extensions: ['.html', '.js', '.jsx', '.json', '.scss']
    },
    devServer: {
      contentBase: `${BUILD}/${path}/`,
      historyApiFallback: true,
      hot: true,
      hotOnly: true,
      open: true,
      inline: true,
      publicPath: '/',
      port: 5000 + i
    },
    plugins: [
      ...plugins,
      new WebpackHTMLPlugin({
        hash: true,
        inject: false,
        minify: PRODUCTION ? {
          html5: true,
          collapseWhitespace: true
        } : false,
        chunks: ['app'],
        template: `${path}/html`,
        filename: 'index.html'
      })
    ]
  }
}
