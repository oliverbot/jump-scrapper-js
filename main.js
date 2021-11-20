import fetch from 'node-fetch';

class JumpIssue {

    issueNumber;

    description;

    coverImageUrl;

    coverDate;

    createdAt;

    constructor(issueNumber = new Number(),
                description = new String(),
                coverImageUrl = new String(),
                coverDate = new String(),
                createdAt = new Date()) {
        this.issueNumber = issueNumber;
        this.description = description;
        this.coverImageUrl = coverImageUrl;
        this.coverDate = coverDate;
        this.createdAt = createdAt;
    }
	
}

    let jumpIssues = [];

    const api_key = "your_key_here";

    async function findJump(offset) {
        const response = await fetch(`https://comicvine.gamespot.com/api/issues/?api_key=${api_key}&format=json&filter=volume:43519&sort=cover_date:asc&field_list=cover_date,issue_number,image,description&offset=${offset}`);
        const data = await response.json();
    
        return data;
    }
    
    async function postIssues(issues) {

    
        const response = await fetch('http://localhost:8080/jump', {method: 'POST', body: JSON.stringify(issues), headers: {'Content-Type': 'application/json'} });
        const data = await response.json();
    
        return data;
    }

    async function main(){
        await processJumpIssues(300);
        await saveIssues(jumpIssues);
    }


    async function loadJump(offset) {
        const response = await findJump(offset).then();

        const result = response.results;

        await findIssues(result)

    }

    async function findIssues(issues) {
        await issues.map( async (issueFromComicVineApi) => {

            let issue = new JumpIssue(issueFromComicVineApi.issue_number, 
                                        issueFromComicVineApi.description, 
                                        issueFromComicVineApi.image.original_url, 
                                        issueFromComicVineApi.cover_date);
                                        console.log(issue)
            await jumpIssues.push(issue)
        })
    }

    async function processJumpIssues(numberOfIssues) {
        for (let i = 0; i < numberOfIssues; i += 100) {
            await loadJump(i);
        }
        return "Operação realizada.";
    }

    async function saveIssues(issues) {
        await postIssues(issues).then();
    }

await main();

