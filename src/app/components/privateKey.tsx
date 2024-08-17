import bs58 from "bs58";

type Props = {
	privateKey: Uint8Array;
};

const getPrivateKey = (props: Props) => {
	const privateKey = bs58.encode(props.privateKey);
	return privateKey;
};

export default getPrivateKey;
