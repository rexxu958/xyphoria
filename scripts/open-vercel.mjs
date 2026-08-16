const url = "https://xyphoria.vercel.app/";

const commands = {
  win32: ["cmd", ["/c", "start", "", url]],
  darwin: ["open", [url]],
  linux: ["xdg-open", [url]],
};

const command = commands[process.platform];

console.log(`XYPHORIA → ${url}`);

if (!command) {
  console.log("Buka URL di atas secara manual.");
  process.exit(0);
}

const { spawn } = await import("node:child_process");
const child = spawn(command[0], command[1], {
  detached: true,
  stdio: "ignore",
});

child.on("error", () => {
  console.log(`Tidak dapat membuka browser otomatis. Buka: ${url}`);
});

child.unref();
