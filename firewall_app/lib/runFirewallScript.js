import { exec } from "child_process";
import path from "path";

// Function to load the compiled kernel module
export async function runFirewallScript() {
  const modulePath = path.join(process.cwd(), "../firewall.ko"); // Kernel module path

  exec(`sudo insmod ${modulePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error inserting kernel module:", error);
      return;
    }
    if (stderr) {
      console.error("Kernel module stderr:", stderr);
    }

    console.log("Firewall kernel module loaded successfully:", stdout);
  });
}
