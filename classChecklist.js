class checklist{

    constructor(titolo,colore,task,statoCheck){
        this.titolo=titolo;
        this.colore=colore;
        this.task=task;
        this.statoCheck=statoCheck;
    }

}

function createStringJson() {
        var stringChecklist={title: this.titolo, color: this.color, task: this.task, checkStatus: this.statoCheck};
        var stringChecklistJson=JSON.stringify(stringChecklist);
}