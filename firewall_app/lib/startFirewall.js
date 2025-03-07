import { exec } from "child_process";
import path from "path";

// Function to load the compiled kernel module
export async function startFirewall() {
  const modulePath = path.join(process.cwd(), "../startFirewall.sh"); // Kernel module path
  exec(`chmod +x ${modulePath}`, (chmodError) => {
    if(chmodError) {
      console.error("Error inserting kernel module:", chmodError);
      return;
    }
    exec(modulePath, (error, stdout, stderr) => {
      if(error){
        console.error("Error executing firewall script:", error)
      }
      if(stderr){
        console.error("Firewall script stderr:", stderr);
      }
      console.log("Firewall kernel module loaded successfully:", stdout);
    })
  });
}
