module.exports = {
  apps: [
    {
      name: "iching-fortune-tell",
      script: "npm",
      args: "run start -- --hostname 127.0.0.1 --port 4173",
      cwd: __dirname + "/..",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
