pragma solidity ^0.4.15;

// FakeSlam! Contract v0.1.0;
contract FakeSlam {
    /** --> STRUCTURES BEGIN HERE <-- */

    // A Vote struct is associated with every user
    struct Vote {
        // Address of the voter
        address adr;

        // Articles he has voted on
        uint[] articleID;

        // His votes (1-1) with articleID
        bool[] isFake;

        // The amount he backed
        uint[] amount;
    }

    // An Article struct to hold article information
    struct Article {
        // Address of voters who voted on the article
        address[] voters;

        // Store the address of voters who made correct prediction
        address[] wonVoters;

        // The amount to be distributed amongst won voters
        uint distributeAmount;

        // The fake and genuine vote count
        uint fakeVoteCount;
        uint genuineVoteCount;

        // The pool amount
        uint fakePool;
        uint genuinePool;

        // Articles result
        bool isActive;
        bool isFake;
    }

    /** MAPPING BEGINS HERE */

    // Mapping Vote struct via user's address
    // This way we map users and his votes
    mapping(address => Vote) public votes;

    // Mapping Article struct via articleID
    mapping(uint => Article) public articles;


    /** --> FUNCTIONS BEGIN HERE <-- */

    /** Called when user votes */
    function vote(uint _articleID, bool _isFake, uint _amount) public {

        // Record the user's vote
        votes[msg.sender].adr = msg.sender;
        votes[msg.sender].articleID.push(_articleID);
        votes[msg.sender].isFake.push(_isFake);
        votes[msg.sender].amount.push(_amount);
        articles[_articleID].voters.push(msg.sender);

        // Add to pool amount
        if (_isFake) {
            articles[_articleID].fakePool += _amount;

            // Increase fake vote count
            articles[_articleID].fakeVoteCount++;

        } else {
            articles[_articleID].genuinePool += _amount;

            // Increase genuine vote count
            articles[_articleID].genuineVoteCount++;
        }

        // Default Init
        articles[_articleID].isActive = true;
        articles[_articleID].isFake = true;
        articles[_articleID].distributeAmount = 0;
    }

    /** Set distribute amount and resolve the article */
    function resolve (uint _articleID, bool _isFake) public {

        // The article voting period has expired
        articles[_articleID].isActive = false;

        // Update the article with the result
        articles[_articleID].isFake = _isFake;

        if (_isFake) {
            // When the result is fake, distribute the genuine pool amount amongst
            // the voters who voted the article as fake
            articles[_articleID].distributeAmount =
            articles[_articleID].genuinePool / articles[_articleID].fakeVoteCount;
        } else {
            // When the result is genuine, distribute the fake pool amount amongst
            // the voters who voted the article as genuine
            articles[_articleID].distributeAmount =
            articles[_articleID].fakePool / articles[_articleID].genuineVoteCount;
        }

        uint articleIndex;
        uint numOfVoters = articles[_articleID].voters.length;

        // Iterate over all the voters (voters[] in Article), and:
        // 1. Store the address of voter in _voter
        // 2. Iterate over his 'votes' to identify the required index
        // 3. Match his prediction to the outcome
        for (uint i = 0; i < numOfVoters; i++) {
            address _voter = articles[_articleID].voters[i];

            uint numOfArticlesVoted = votes[_voter].articleID.length;
            for (uint j = 0; j < numOfArticlesVoted; j++) {
                if (votes[_voter].articleID[j] == _articleID)
                    articleIndex = j;
            }
            // If the voter's prediction matches the outcome, push his address
            // in the wonVoters array
            if (votes[_voter].isFake[articleIndex] == _isFake)
                articles[_articleID].wonVoters.push(_voter);
        }
    }

    /** Returns the Fake Pool amount for a given article */
    // function getFakePoolAmount (uint _articleID) public constant returns (uint) {
    //     return articles[_articleID].fakePool;
    // }

    /** Returns the Genuine Pool amount for a given article */
    // function getGenuinePoolAmount (uint _articleID) public constant returns (uint) {
    //     return articles[_articleID].genuinePool;
    // }

    // /** Returns the vote history of a user*/
    // function getVote() public constant returns (bool[]) {
    //     return votes[msg.sender].isFake;
    // }

    // /** Returns the backing amount history of a user*/
    // function getAmount() public constant returns (uint[]) {
    //     return votes[msg.sender].amount;
    // }

    // /** Returns the article voting history of a user*/
    // function getArticle() public constant returns (uint[]) {
    //     return votes[msg.sender].articleID;
    // }

    // /** Returns the won voters array*/
    // function getWonVoters(uint _articleID) public constant returns (address[]) {
    //     return articles[_articleID].wonVoters;
    // }

    /** Called by user, returns the amount won for a given article, 0 incase lost */
    function getWonAmount(uint _articleID) public constant returns (uint amount) {
        amount = 0;
        if (articles[_articleID].isActive == false) {
            uint numOfWonVoters = articles[_articleID].wonVoters.length;
            for (uint i = 0; i < numOfWonVoters; i++) {
                if (articles[_articleID].wonVoters[i] == msg.sender) {
                    amount = articles[_articleID].distributeAmount;
                }
            }
        }
    }
}
