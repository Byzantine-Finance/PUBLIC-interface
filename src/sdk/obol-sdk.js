import { Client, validateClusterLock } from "@obolnetwork/obol-sdk";
import { ethers } from "ethers";

/** Instantiates Obol SDK CLient
 * @returns Obol SDK client
 */
const obolClient = async() => {

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const client = new Client({ baseUrl: "https://api.obol.tech", chainId: 5 },
        signer
    );
    console.log(client, "client");
    return client;
};

/**
 * Returns the cluster config hash after saving cluster definition
 * @param cluster The cluster defintion { name:string, operators:{address:string}[], validators:{fee_recipient_address:string,withdrawal_address:string}[]}
 * @returns The config hash
 */
export const createObolCluster = async(clusterConfig) => {
    try {
        const client = await obolClient();
        const configHash = await client.createClusterDefinition(clusterConfig);
        //console.log(configHash, "configHash");
        return configHash;
    } catch (err) {
        console.log(err, "err");
    }
};

/**
 * Returns the cluster definition
 * @param configHash The cluster hash returned from createClusterDefinition
 * @returns The partial/complete cluster definition
 */
const getObolClusterDefinition = async(configHash) => {
    try {
        //const client = await obolClient();
        const clusterDefinition = await client.getClusterDefinition(configHash);
        return clusterDefinition;
    } catch (err) {
        console.log(err, "err");
    }
};

/**
 * Returns the cluster lock
 * @param configHash The cluster hash returned from createClusterDefinition
 * @returns The cluster lock
 */
const getObolClusterLock = async(configHash) => {
    try {
        //const client = await obolClient();
        const lockFile = await client.getClusterLock(configHash);
        return lockFile;
    } catch (err) {
        console.log(err, "err");
    }
};

/**
 * Accepts joining a cluster
 * @param operatorPayload.enr The operator enr
 * @param operatorPayload.version The cluster configuration version
 * @param configHash The cluster configHash
 * @returns the updated cluster
 */
const acceptClusterDefinition = async({ enr, version }, configHash) => {
    try {
        //const client = await obolClient();
        const updatedClusterDefintiion = await client.acceptClusterDefinition({
                enr,
                version,
            },
            configHash
        );
        return updatedClusterDefintiion;
    } catch (err) {
        console.log(err, "err");
    }
};

/**
 * Returns if clusterLock is valid
 * @param clusterLock The clusterLock file that requires verification
 * @returns true if it is valid
 */
const validateObolClusterLock = async(clusterLock) => {
    try {
        const isValidLock = await validateClusterLock(clusterLock);
        return isValidLock;
    } catch (err) {
        console.log(err, "err");
    }
};

/**
 * Activates cluster by depositing 32 ethers
 * @param clusterLock The cluster lock that contains the validator to be activated
 * @param validatorIndex The validator index
 */
const activateValidator = async(clusterLock, validatorIndex) => {
    try {
        let DEPOSIT_CONTRACT_ADDRESS; // 0x00000000219ab540356cBB839Cbe05303d7705Fa for Mainnet, "0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b" for GOERLI
        let depositContractABI; // https://etherscan.io/address/0x00000000219ab540356cBB839Cbe05303d7705Fa#code for Mainnet, and replace the address for Goerli
        const validatorDepositData =
            clusterLock.distributed_validators[validatorIndex].deposit_data;

        const depositContract = new ethers.Contract(
            DEPOSIT_CONTRACT_ADDRESS,
            depositContractABI,
            signer
        );

        const TX_VALUE = ethers.parseEther("32");

        const tx = await depositContract.deposit(
            validatorDepositData.pubkey,
            validatorDepositData.withdrawal_credentials,
            validatorDepositData.signature,
            validatorDepositData.deposit_data_root, { value: TX_VALUE }
        );

        await tx.wait();
        return;
    } catch (err) {
        console.log(err, "err");
    }
};

//console.log(createObolCluster());