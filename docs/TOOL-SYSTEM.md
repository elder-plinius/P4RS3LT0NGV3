# Tool System - Build-Time Template Injection

## Architecture

- **Templates**: Separate `.html` files in `templates/` directory
- **Build Process**: Injected into `index.html` at build time
- **Result**: Single static HTML file (fast loading, no HTTP requests)

## File Structure

```
├── index.template.html      # Base shell
├── index.html               # Generated (templates injected)
├── templates/               # Edit HTML here
│   ├── decoder.html
│   ├── steganography.html
│   └── ...
├── js/tools/               # Tool classes (logic)
│   ├── Tool.js            # Base class
│   └── *Tool.js           # Auto-discovered
└── build/
    └── inject-tool-templates.js
```

## Creating a New Tool

### 1. Create Tool Class

`js/tools/MyTool.js`:
```javascript
class MyTool extends Tool {
    constructor() {
        super({
            id: 'mytool',
            name: 'My Tool',
            icon: 'fa-star',
            title: 'Description',
            order: 10
        });
    }
    
    getVueData() {
        return { myInput: '', myOutput: '' };
    }
    
    getVueMethods() {
        return {
            processInput() {
                this.myOutput = this.myInput.toUpperCase();
            }
        };
    }
}
```

### 2. Create Template

`templates/mytool.html`:
```html
<div v-if="activeTab === 'mytool'" class="tab-content">
    <div class="transform-layout">
        <div class="transform-section">
            <div class="section-header">
                <h3><i class="fas fa-star"></i> My Tool <small>short subtitle</small></h3>
            </div>
            <div class="input-section">
                <textarea v-model="myInput" @input="processInput"></textarea>
            </div>
            <div class="tool-toolbar">
                <button type="button" class="transform-button tool-primary-btn" @click="processInput">
                    <i class="fas fa-bolt"></i> Run
                </button>
            </div>
            <div v-if="myOutput" class="output-container">{{ myOutput }}</div>
        </div>
    </div>
</div>
```

### 3. Build

```bash
npm run build:tools      # Auto-discovers and registers tool
npm run build:templates  # Injects template into index.html
```

## How It Works

1. **Development**: Edit templates in `templates/*.html`
2. **Build**: `inject-tool-templates.js` reads templates and injects into `index.template.html`
3. **Output**: Complete `index.html` with all templates embedded
4. **Browser**: Vue compiles templates at page load (already in DOM)

## Tool UI classes (CSS)

Use the shared vocabulary in [`css/style.css`](../css/style.css) (see the “STANDARD UI COMPONENT TEMPLATES” comment block at the top) so new tools match existing ones.

| Role | Class | Notes |
|------|--------|--------|
| Tool root | `tab-content` | Root `v-if` wrapper for each tool |
| Column layout | `transform-layout` | Flex column with vertical `gap`; `position: relative` for sticky input |
| Card / panel | `transform-section` | Optional tool-specific modifier (e.g. `bijection-section`) for one-off tweaks |
| Page title | `section-header` | Icon + `h3` + optional `<small>` subtitle |
| Intro with long description | `section-header-card` | Use when you need a paragraph under the title (see Gibberish / Splitter) |
| **Action row** | **`tool-toolbar`** | **Primary row for Generate/Copy/Download** — always use this name (not `mutation-actions` / `token-bomb-actions`) |
| Primary CTA | `transform-button tool-primary-btn` | Main “generate” or “run” action inside the toolbar |
| Secondary actions | `action-button copy` / `action-button download` | Toolbar copy/download styling |
| Textarea + floating copy | `textarea-copy-wrap` | Wraps `textarea` + `copy-button` when the copy control is absolutely positioned |
| Small spacing | `u-mb-8`, `u-mb-16`, `u-mt-16` | Prefer these over inline `style` for margins |

Avoid inline `style` on templates; add a small utility or semantic class in `style.css` if you need a new pattern.

### Slide-out sidebars (global shell)

Panels in [`index.template.html`](../index.template.html) (Copy History, Glitch Tokens, End sequences, Advanced Settings) share the same **structural** classes; keep tool-specific names for width/theme hooks only.

| Class | Role |
|--------|------|
| `app-sidebar` | Fixed column from the right: flex column, `transform` slide-in, `active` opens |
| `app-sidebar-header` | Title row + actions (with tool-specific class, e.g. `copy-history-header`) |
| `app-sidebar-body` | Scrollable content (`flex: 1`, `overflow-y: auto`) |

All sidebars share **`--sidebar-width`** (desktop, default `420px`) and **`max-width: min(100%, 90vw)`**. From **768px** breakpoint down they are **full viewport width** (`100%`). Only **stacking** differs: `.unicode-options-panel` uses a higher **`z-index`** (200 desktop, 300 on small screens) so Advanced Settings stays above other panels. Shared shadow: **`--sidebar-edge-shadow`** in `:root`.

**Maintaining `style.css`:** Prefer comma-separated selectors when multiple unrelated classes share the same declarations (e.g. Bijection / PromptCraft / Anti-Classifier card shells). Reuse `:root` tokens such as `--panel-shadow-soft` for repeated shadows instead of copying the same `box-shadow` value.
