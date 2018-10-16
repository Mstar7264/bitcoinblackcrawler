import { exec } from "child_process";
import { promisify } from "es6-promisify";
import pidusage from "pidusage";

const pExec = promisify(exec);

let BITCOINBLACK_PID;

export default async function getStats() {
  if (!BITCOINBLACK_PID) await discoverPid();

  try {
    return await pidusage(BITCOINBLACK_PID);
  } catch (e) {
    console.log(e.message);
    BITCOINBLACK_PID = null;
    return {};
  }
}

async function discoverPid() {
  try {
    RAI_PID = await pExec("pgrep bitcoinblack_node");
    console.log("bitcoinblack_node:", BITCOINBLACK_PID);
  } catch (e) {
    console.log(e.message);
  }
}
