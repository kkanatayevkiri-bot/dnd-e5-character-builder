class ClassSheet
{
    constructor(
        hitDice,
        HitPoints,
        armor,
        weapons,
        Tools=null,
        savingThrowProficiencies,
        skillProficiencies,
        skillExpertise,
        proficiency,
        proficiencyNum,
        expertiseNum
    )
    {
        //stats
        this.stats = {
            'strength': 8,
            'dexterity': 8,
            'constitution': 8,
            'intelligence': 8,
            'wisdom': 8,
            'charisma': 8
        };
        //sub skills for each stat:
        this.skills = {
            "strength":{"Athletics":-1},
            "dexterity":{
                "Acrobatics":-1,
                "Sleight of Hand":-1,
                "Stealth":-1
            },
            "intelligence":{
                "Arcana":-1,
                "History":-1,
                "Investigation":-1,
                "Nature":-1,
                "Religion":-1
            },
            "wisdom":{
                "Animal Handling":-1,
                "Insight":-1,
                "Medicine":-1,
                "Perception":-1,
                "Survival":-1
            },
            "charisma":{
                "Deception":-1,
                "Intimidation":-1,
                "Performance":-1,
                "Persuasion":-1
            }
        }
        this.level = 1;
        this.currentPoints = 24;
        this.hitDice = hitDice; //int
        this.baseHp = HitPoints;
        this.HitPoints = this.calcHitPoints(); //int
        this.armor = armor; //list
        this.weapons = weapons; //list
        this.Tools = Tools; //boolean
        this.savingThrowProficiencies = savingThrowProficiencies; //dict
        this.skillProficiencies = skillProficiencies; //dict
        this.skillExpertise = skillExpertise; //dict
        this.proficiency = proficiency; //int
        this.proficiencyNum = proficiencyNum; //int
        this.expertiseNum = expertiseNum; //int
    }

    calcHitPoints()
    {
        return this.baseHp+this.getModifire['constitution'];
    }

    addPoint(stat)
    {
        if (this.stats[stat] >= 20 || this.currentPoints === 0)return;

        this.stats[stat]++;
        this.currentPoints--;

        //update visual
        this.updateStat(stat);
        this.updateModifire(stat);
        this.updateSavingThrow(stat);
        this.updateCharacter();
    }

    decPoint(stat)
    {
        if (this.stats[stat] === 8 || this.currentPoints === 24)return;

        this.stats[stat]--;
        this.currentPoints++;

        //update visual
        this.updateStat(stat);
        this.updateModifire(stat);
        this.updateSavingThrow(stat);
        this.updateCharacter();
    }

    getST(stat) //saving Throw
    {
        let mod = this.getModifire(stat);
        return this.savingThrowProficiencies[stat]? mod+this.proficiency: mod;
    }
    updateStat(stat)
    {
        let content = document.getElementById(`stat-${stat}`);
        content.innerHTML = this.stats[stat];
    }

    updateModifire(stat)
    {
        let content = document.getElementById(`modifire-${stat}`);
        content.innerHTML = this.getModifire(stat);
    }

    updateSavingThrow(stat)
    {
        let content = document.getElementById(`saving-throw-${stat}`);
        let num = this.getModifire(stat);
        if (this.savingThrowProficiencies[stat])num+=this.proficiency;
        content.innerHTML = num;
    }

    getModifire(stat)
    {
        return Math.floor((this.stats[stat]-10)/2);
    }

    updateSkills()
    {
        for (const [stat, skills] of Object.entries(this.skills))
        {
            for (const skill of Object.keys(skills))
            {
                let mod = this.getModifire[stat];
                if(this.skillProficiencies[skill])mod+=this.proficiency;
                if(this.skillExpertise[skill])mod+=this.proficiency;
                this.skills[stat][skill] = mod;
            }
        }
    }

    //proficincy logic:
    disableNoneProficient()
    {
        // console.log("click");
        const skills = document.querySelectorAll('input[name="proficiency"]');
        const proficentSkills = Object.keys(this.skillProficiencies);
        // console.log(proficentSkills);
        skills.forEach((skill)=>{
            if (!proficentSkills.includes(skill.value))skill.disabled=true;
            else skill.disabled=false;
        })
    }

    checkSkill(skill)
    {
        if (Object.keys(this.skillProficiencies).includes(skill))
        {
            console.log("worked");
            if(this.skillProficiencies[skill]===false)this.skillProficiencies[skill]=true;
            else this.skillProficiencies[skill]=false;
            // console.log(this.skillProficiencies);
        }
    }

    disableUnhceckedSKills()
    {
        // console.log('works');
        const skills = Object.entries(this.skillProficiencies);
        // console.log(skills);
        for(const [skill, bool] of skills)
        {
            const skillBox = document.querySelector(`input[value="${skill}"]`);
            if (!bool)skillBox.disabled=true;
        }
    }

    countProficincyPoints()
    {
        let num = document.querySelectorAll('input[name="proficiency"]:checked').length;
        let pline = document.getElementById('Ppoints');
        pline.innerHTML = this.proficiency-num;
    }

    turnOnPossibleExpertise(skill)
    {
        const isProf = Object.keys(this.skillExpertise).includes(skill)??false;
        const isEper = this.skillProficiencies[skill]??false;
        const skillLine = document.getElementById(`exp-${skill}`);
        console.log(isProf, isEper);
        if(isProf && isEper)
        {
            skillLine.disabled = false;
        }
    }

    proficiencyCap(skill)
    {
        this.checkSkill(skill);
        this.turnOnPossibleExpertise(skill);
        let num = document.querySelectorAll('input[name="proficiency"]:checked').length;
        this.countProficincyPoints();
        // console.log("works");
        if (num == this.proficiencyNum)
        {
            this.disableUnhceckedSKills();
        }
        else
        {
            this.updateCharacter();
        }
    }

    //Expertise logic:
    countExpertisePoints()
    {
        let num = document.querySelectorAll('input[name="expertise"]:checked').length;
        let line = document.getElementById('Epoints');
        line.innerHTML = this.expertiseNum - num;
    }

    turnOffNoneExpertise()
    {   
        const exper = document.querySelectorAll('input[name="expertise"]');
        exper.forEach((skill)=>{
            if(!this.skillProficiencies[skill.value])skill.disabled = true;
            if (skill.checked) skill.disabled = false;
        })
    }

    keepCheckedOn()
    {
        const exper = document.querySelectorAll('input[name="expertise"]:checked');
        exper.forEach((skill)=>{
            if(skill.checked && !this.skillProficiencies[skill.value])skill.checked = false;
            skill.disabled = false;
        })
    }

    turnOffNoneCheckedExpertise()
    {
        let exper = document.querySelectorAll('input[name="expertise"]');
        exper.forEach((skill)=>
        {
            if (!skill.checked)skill.disabled=true;
        })
    }

    toggleExpertise(skill)
    {
        if(!this.skillExpertise[skill])this.skillExpertise[skill]=true; //turn on if off.
        else this.skillExpertise[skill]=false; //turn off if on. (if selected again)
    }

    expertiseCap(skill)
    {
        this.toggleExpertise(skill);
        let num = document.querySelectorAll('input[name="expertise"]:checked').length;
        this.countExpertisePoints();
        if(num == this.expertiseNum)
        {
            this.turnOffNoneCheckedExpertise();
        }
        else
        {
            this.updateCharacter();
        }
    }

    //render:
    renderStats()
    {
        // console.log("worked");
        let placeHolder = document.getElementById('stat-cont');
        let content = "";
        for(const [stat, val] of Object.entries(this.stats))
        {
            content+=`<button onclick='currClass.addPoint("${stat}")'>+</button>${stat}:<div id='stat-${stat}' style='display:inline;'>${val}</div><button onclick="currClass.decPoint('${stat}')">-</button><br><br>`
        }
        placeHolder.innerHTML = content;
    }

    rederModifier()
    {
        let placeHolder = document.getElementById('modifiers-cont');
        let content = "";
        let statsLis = Object.keys(this.stats)
        statsLis.forEach((stat)=>{
            content+=`${stat}: <div id='modifire-${stat}' style='display:inline;'>${this.getModifire(stat)}</div><br><br>`
        })
        placeHolder.innerHTML = content;
    }

    renderST() //Saving Throw
    {
        let content = document.getElementById('saving-throws-cont');
        let continer = "";
        let statsLis = Object.keys(this.stats);
        statsLis.forEach((stat)=>{
            continer+=`${stat}: <div id='saving-throw-${stat}' style='display:inline;'>${this.getST(stat)}</div><br><br>`
        })
        content.innerHTML = continer;
    }
    
    addSomething(){}


    //refresh after every input:
    updateCharacter()
    {
        this.updateSkills();
        this.keepCheckedOn();
        this.disableNoneProficient();
        this.turnOffNoneExpertise();
        this.countProficincyPoints();
        this.countExpertisePoints();
        this.HitPoints = this.calcHitPoints()
    }
}

class Paldain extends ClassSheet
{
    constructor()
    {
        super(
        "1d10",
        10,
        ["all armors"],
        ['simple weapons', 'martial weapons'],
        null,
        {
            "charisma":true,"wisdom":true
        },
        {
            "Athletics":false,
            "Insight":false,
            "Intimidation":false,
            "Medicine":false,
            "Persuasion":false,
            "Religion":false
        },
        {},
        2,
        2,
        0
    )
    }
}

class Fighter extends ClassSheet
{
    constructor()
    {
        super(
        "1d10",
        10,
        ["all armors",'shields'],
        ['simple weapons', 'martial weapons'],
        null,
        {
            "Strength":true,"Constitution":true
        },
        {
            "Acrobatics":false,
            "Animal Handling":false,
            "Athletics":false,
            "History":false,
            "Insight":false,
            "Intimidation":false,
            "Perception":false,
            "Survival":false
        },
        {},
        2,
        2,
        0
    )
    }
}

const classes = {'paladin':new Paldain(), 'fighter':new Fighter()}
let currClass = classes['paladin'];
currClass.updateCharacter();
currClass.renderStats();
currClass.rederModifier();
currClass.renderST();

function changeClass(c)
{
    currClass = classes[c];
    currClass.updateCharacter();
    currClass.renderStats();
}