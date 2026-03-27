const os = require('os');

// Helper to find local IP
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const ip = getLocalIp();
const url = `http://${ip}:3000`;

console.log('---------------------------------------------------');
console.log('Generating QR Code for:', url);
console.log('---------------------------------------------------');

try {
    const qrcode = require('qrcode-terminal');
    qrcode.generate(url, { small: true });
} catch (e) {
    console.error('\nError: "qrcode-terminal" is not installed.');
    console.error('Please run: npm install qrcode-terminal\n');
}
