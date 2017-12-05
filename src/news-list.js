import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import '../node_modules/@polymer/app-layout/app-grid/app-grid-style.js';
import { Debouncer } from '../node_modules/@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '../node_modules/@polymer/polymer/lib/utils/async.js';
import './news-iframe.js';
import './news-list-featured-item.js';
import './news-list-item.js';
import './news-side-list.js';

class NewsList extends Element {
  static get template() {
    return `
    <style include="app-grid-style">

      :host {
        display: block;
      }

      [hidden] {
        display: none !important;
      }

      .container .fade-in {
        opacity: 0;
      }

      .container[fade-in] .fade-in {
        opacity: 1;
        transition: opacity 500ms;
      }

      .content {
        @apply --layout-flex;
      }

      .article-grid,
      .opinions-grid {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .article-grid {
        margin-top: 32px;
      }

      li {
        display: block;
      }

      h3 {
        @apply --app-sub-section-headline;
        margin: 24px 0;
      }

      news-side-list {
        margin-bottom: 32px;
      }

      news-iframe {
        width: 300px;
        height: 250px;
      }

      .ad-container {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }

      /* mobile */
      @media (max-width: 767px) {
        aside {
          display: none;
        }

        .article-grid li,
        .opinions-grid li{
          border-bottom: var(--app-border-style);
          margin: 0px 24px 24px 24px;
          padding-bottom: 24px;
        }

        .article-grid li:last-of-type,
        .opinions-grid li:last-of-type {
          border-bottom: none;
        }
      }

      /* desktop */
      @media (min-width: 768px) {
        :host {
          --app-grid-columns: 4;
          --app-grid-gutter: 32px;
        }

        .opinions-grid {
          @apply --layout-horizontal;
          @apply --layout-wrap;
        }

        .opinions-grid li {
          width: calc(50% - 32px);
          margin-right: 32px;
        }

        .article-grid,
        .opinions-grid {
          margin-right: -32px;
        }
      }

      /* desktop large */
      @media (min-width: 1310px) {
        .container {
          @apply --layout-horizontal;
        }

        .content {
          margin-right: 24px;
        }

        aside {
          width: 300px;
          min-width: 300px;
        }
      }

    </style>

    <div class="container" fade-in$="[[!category.loading]]" hidden$="[[category.failure]]">
      <div class="content">
        <news-list-featured-item item="[[_getFeaturedItem(category.items)]]">
        </news-list-featured-item>

        <ul class="app-grid article-grid fade-in">
          <dom-repeat items="[[_slice(category.items, 1, 5)]]">
            <template>
              <li>
                <news-list-item item="[[item]]"></news-list-item>
              </li>
            </template>
          </dom-repeat>
        </ul>

        <h3>Opinions</h3>
        <ul class="opinions-grid fade-in">
          <dom-repeat items="[[_slice(category.items, 5)]]">
            <template>
              <li>
                <news-list-item horizontal item="[[item]]"></news-list-item>
              </li>
            </template>
          </dom-repeat>
        </ul>
      </div>

      <aside>
        <div class="ad-container">
          <news-iframe src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=12&l=ur1&f=ifr"></news-iframe>
        </div>
        <news-side-list class="fade-in" items="[[_slice(category.items, 0, 3)]]">
          Most Read
        </news-side-list>
        <news-side-list class="fade-in" featured items="[[_slice(category.items, 3, 9)]]">
          More Top Stories
        </news-side-list>
      </aside>
    </div>

    <news-network-warning
        hidden$="[[!category.failure]]"
        offline="[[offline]]"
        on-try-reconnect="_tryReconnect"></news-network-warning>
    `;
  }

  static get is() { return 'news-list'; }

  static get properties() { return {
    category: Object,
    offline: Boolean
  }}

  connectedCallback() {
    super.connectedCallback();
    this._boundResizeHandler = this._resizeHandler.bind(this);
    window.addEventListener('resize', this._boundResizeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._boundResizeHandler);
  }

  _getFeaturedItem(items) {
    return items ? items[0] : {};
  }

  _tryReconnect() {
    this.dispatchEvent(new CustomEvent('refresh-data', {bubbles: true, composed: true}));
  }

  _resizeHandler() {
    this._resizeDebouncer = Debouncer.debounce(this._resizeDebouncer,
      timeOut.after(50), () => { this.updateStyles(); });
  }

  _slice(list, begin, end) {
    if (list) {
      return list.slice(begin, end);
    }
  }

  _return(value) {
    return value;
  }

}

customElements.define(NewsList.is, NewsList);
