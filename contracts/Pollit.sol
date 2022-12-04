// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint256[] memory pubSignals)
        external
        view
        returns (bool);
} 

contract pollIt {
    using Counters for Counters.Counter;

    Counters.Counter _proposalId;

    address plonkVerifier = 0x62117ea62ab34172F6b001A0299c677602647Dc2;
    IPlonkVerifier verifier;
    mapping(bytes32 => bool) public nullifierSpent;

    uint256 constant SNARK_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    constructor(
        IPlonkVerifier _verifier
    ) {
    
        verifier = _verifier;
    }

    struct VotingProposal {
        uint pId;
        address creatorOfProposal;
        address nftContractId;
        string ipfsUri;
        uint voteYes;
        uint voteNo;
        bytes32 mkRoot;
        bool isCompleted;
    }

// stores both projectAddress -> announcement and user -> announcement
    // mapping(address => string[]) addressToAnnouncement;
    mapping(uint => VotingProposal) proposalMapping;

// stores both projectAddress -> proposals
    mapping(address => uint[]) nftContractToProposal;

    function createProposal(address _nftContract, string calldata _ipfsUri, bytes32 _mkRoot) public returns (uint) {
        require(IERC721(_nftContract).balanceOf(msg.sender) > 0, "you don't own an NFT in this project");
        _proposalId.increment();
        uint pId = _proposalId.current();
        proposalMapping[pId] = VotingProposal(
            pId,
            msg.sender,
            _nftContract,
            _ipfsUri,
            0,
            0,
            _mkRoot,
            false
        );
        nftContractToProposal[_nftContract].push(pId);
        return pId;
    }

    function getProposalsForNftContract(address _nftContract) public view returns (VotingProposal[] memory) {
        uint siz = nftContractToProposal[_nftContract].length;
        VotingProposal[] memory vpArr = new VotingProposal[](siz);
        for(uint i=0; i<nftContractToProposal[_nftContract].length;i++) {
            VotingProposal storage curr = proposalMapping[nftContractToProposal[_nftContract][i]];
            vpArr[i] = (curr);
        }
        return vpArr;
    }

    function walletHoldsToken(address _wallet, address _contract) public view returns (bool) {
    return IERC721(_contract).balanceOf(_wallet) > 0;
  }
    
    function castVote(bytes calldata proof, bytes32 nullifierHash, uint proposalId, bool vote) public {
        require(
            uint256(nullifierHash) < SNARK_FIELD,
            "Nullifier is not within the field"
        );
        require(!nullifierSpent[nullifierHash], "vote already casted");
        VotingProposal memory p = proposalMapping[proposalId];

        uint256[] memory pubSignals = new uint256[](3);
        pubSignals[0] = uint256(p.mkRoot);
        pubSignals[1] = uint256(nullifierHash);
        pubSignals[2] = uint256(uint160(msg.sender));
        require(
            IPlonkVerifier(verifier).verifyProof(proof, pubSignals),
            "Proof verification failed"
        );
        nullifierSpent[nullifierHash] = true;
       if(vote == true){
            proposalMapping[proposalId].voteYes=proposalMapping[proposalId].voteYes+1;
        } else {
            proposalMapping[proposalId].voteNo = proposalMapping[proposalId].voteNo +1;
        }
    }

    function completeVotingProposal(uint pId) public returns (bool){
        VotingProposal memory v = proposalMapping[pId];
        require(msg.sender == v.creatorOfProposal, "only creator can end the proposal");
        v.isCompleted = true; 
        return true;
    }

    function updateTree(bytes32 t, uint pid) public {
        // add validation if needed
        proposalMapping[pid].mkRoot = t;
    }
    
}