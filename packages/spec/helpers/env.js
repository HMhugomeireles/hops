const NodeEnvironment = require('jest-environment-node');
const debug = require('debug')('hops-spec:env');
const {
  launchPuppeteer,
  startServer,
  build,
  createWorkingDir,
} = require('./test-helpers');

function getProperty(property, selector) {
  return this.$(selector)
    .then(h => h.getProperty(property))
    .then(h => h.jsonValue());
}

async function getElementByText(rawText) {
  const text = rawText.toLowerCase();
  const handle = await this.$x(
    `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text}')]`
  );

  if (handle.length === 0) {
    throw new Error(`Can not find element by text: ${text}`);
  } else if (handle.length > 1) {
    console.warn(
      `getElementByText with text: ${text} found more than one element. Using only the first one.`
    );
  }

  return handle[0];
}

class FixtureEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    this.config = config;
  }
  async setup() {
    await super.setup();
    debug('Creating working directory for:', this.config.rootDir);
    const { cwd, removeWorkingDir } = await createWorkingDir(
      this.config.rootDir
    );
    debug('Working directory created:', cwd);
    this.cwd = cwd;
    this.removeWorkingDir = removeWorkingDir;
    const { browser, teardown: closeBrowser } = await launchPuppeteer();
    this.closeBrowser = closeBrowser;
    this.global.browser = browser;
    this.global.cwd = cwd;

    this.global.createPage = async () => {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);
      page.on('error', error => {
        throw error;
      });
      page.on('pageerror', error => {
        throw error;
      });

      page.on('console', msg => {
        if (['error', 'warning'].includes(msg.type())) {
          throw new Error(`${msg.type()} in browser console: ${msg.text()}`);
        }
      });

      return {
        page,
        getProperty: getProperty.bind(page),
        getInnerText: getProperty.bind(page, 'innerText'),
        getElementByText: getElementByText.bind(page),
      };
    };

    const that = this;
    this.global.HopsCLI = {
      build(...argv) {
        return build({ cwd: that.cwd, argv });
      },
      async start(...argv) {
        if (that.killServer) {
          throw new Error(
            'Another long running task ("hops start") is already running. You can only start one task per file.'
          );
        }
        const { url, teardown } = await startServer({
          cwd: that.cwd,
          command: 'start',
          argv,
        });
        that.killServer = teardown;
        return url;
      },
    };
  }

  async teardown() {
    await super.teardown();
    await this.removeWorkingDir();
    await this.closeBrowser();
    if (this.killServer) {
      await this.killServer();
    }
  }
}

module.exports = FixtureEnvironment;
