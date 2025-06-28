const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const CompilerPhases = require('./compiler-phases');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (web interface)
app.use(express.static(path.join(__dirname, '..')));

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(tempDir);

// Utility function to create temporary file
function createTempFile(code, extension = '.c') {
    const filename = `temp_${uuidv4()}${extension}`;
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, code);
    return { filename, filepath };
}

// Utility function to cleanup temporary file
function cleanupTempFile(filepath) {
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    } catch (error) {
        console.error('Error cleaning up temp file:', error);
    }
}

// Utility function to execute compiler
function executeCompiler(filepath, phase = 'all') {
    return new Promise((resolve, reject) => {
        const compilerPath = path.join(__dirname, '..', 'src', 'compiler_web');
        const command = `${compilerPath} --phase=${phase} --json "${filepath}"`;
        
        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
                reject({
                    success: false,
                    error: error.message,
                    stderr: stderr,
                    phase: phase
                });
            } else {
                try {
                    const result = JSON.parse(stdout);
                    resolve({
                        success: true,
                        data: result,
                        phase: phase
                    });
                } catch (parseError) {
                    // If JSON parsing fails, return raw output
                    resolve({
                        success: true,
                        data: {
                            raw_output: stdout,
                            stderr: stderr
                        },
                        phase: phase
                    });
                }
            }
        });
    });
}

// API Routes

// Serve web interface at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web-interface-mockup.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: '🧙‍♂️ CodeWizard Backend is running',
        platform: process.env.RAILWAY_ENVIRONMENT ? 'Railway' : 'Local',
        timestamp: new Date().toISOString()
    });
});

// Get examples catalog
app.get('/api/examples', (req, res) => {
    try {
        const catalogPath = path.join(__dirname, '..', 'tests', 'examples_catalog.json');
        const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
        res.json(catalog);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to load examples catalog'
        });
    }
});

// Get specific example code
app.get('/api/examples/:exampleId', (req, res) => {
    try {
        const catalogPath = path.join(__dirname, '..', 'tests', 'examples_catalog.json');
        const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

        const example = catalog.examples.find(ex => ex.id === req.params.exampleId);
        if (!example) {
            return res.status(404).json({
                success: false,
                error: 'Example not found'
            });
        }

        const examplePath = path.join(__dirname, '..', 'tests', example.file);
        const code = fs.readFileSync(examplePath, 'utf8');

        res.json({
            success: true,
            example: example,
            code: code
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to load example code'
        });
    }
});

// Complete compilation - all phases
app.post('/api/compile', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.compileAll(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'all'
        });
    }
});

// Lexical Analysis
app.post('/api/compile/lexer', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.generateTokens(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'lexer'
        });
    }
});

// Parse Tree Generation
app.post('/api/compile/parsetree', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.generateParseTree(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'parsetree'
        });
    }
});

// AST Generation
app.post('/api/compile/ast', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.generateAST(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'ast'
        });
    }
});

// Semantic Analysis
app.post('/api/compile/semantic', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.performSemanticAnalysis(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'semantic'
        });
    }
});

// Intermediate Representation
app.post('/api/compile/ir', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.generateIR(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'ir'
        });
    }
});

// Code Generation
app.post('/api/compile/codegen', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.generateCode(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'codegen'
        });
    }
});

// Program Execution
app.post('/api/compile/execution', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    try {
        const result = CompilerPhases.executeProgram(code);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            phase: 'execution'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🧙‍♂️ CodeWizard Backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
