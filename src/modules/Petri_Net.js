 import Place from "./Place.js"
 import Transition from "./Transition.js"
 import Arc from "./Arc.js"


 class Petri_Net {  
    constructor(nbSim) {
        this.nb_place = 0;
        this.nb_arc = 0;
        this.nb_transition = 0;
        this.nb_immediate_enabled = 0;
        this.description = "";
        this.date_creation = "";
        this.name = "";
        this.currant_marking = [];
        this.initial_marking=[];
        this.currant_marking_tangible = false;
        this.nb_simulation = nbSim||100;
        this.arc = [];
        this.pre = [];
        this.post = [];
        this.place = [];
        this.transition = [];
        this.parameter = 0;
        this.enabled_immediate = [];
        this.enabled_temporary = [];
        this.weight_sum = [];
        this.blocked = false;
        this.bounded = false;
    }
  
    create_pre_post() {
        this.pre = new Array(this.nb_place).fill(null).map(() => new Array(this.nb_transition).fill(null).map(() => ({ arc_weight: 0, inhibitor: false })));
        this.post = new Array(this.nb_place).fill(null).map(() => new Array(this.nb_transition).fill(0));
    
        // Assigning arcs' weights and types
        for (let i = 0; i < this.nb_arc; i++) {
            if (this.arc[i].placeToTransition == true) {
                this.pre[this.arc[i].Place.id_place][this.arc[i].Transition.id_transition].arc_weight = this.arc[i].weight;
                this.pre[this.arc[i].Place.id_place][this.arc[i].Transition.id_transition].inhibitor = this.arc[i].Inhibitor;
            } else {
                this.post[this.arc[i].Place.id_place][this.arc[i].Transition.id_transition] = this.arc[i].weight;
            }
        }
    }
    
    
  
    getMarquageInitial (){
        for( let i = 0 ; i< this.nb_place ; i ++ ){
        this.initial_marking[i]= this.place[i].nb_tokens ; 
        }
    }
  
  
    Enabling() {
        let temp = 0;
        let j = 0;
        let stop_timed = false;
        for (let i = 0; i < this.nb_transition; i++) {
            this.transition[i].enabled();
            if (this.transition[i].is_enabled) {
                if (this.transition[i].getPriority() === 1) {
                    this.enabled_immediate.push([i, -1]);
                    this.nb_immediate_enabled++;
                    stop_timed = true;
                } else {
                    if (!stop_timed) {
                        temp += this.transition[i].getFiring_rate();
                        this.enabled_temporary[j] = i;
                        j++;
                    }
                }
            }
        }
        if (j === 0 && this.nb_immediate_enabled === 0) {
            this.blocked = true;
            this.bounded = true;
        }
        if (this.nb_immediate_enabled === 0 && j !== 0) {
            this.currant_marking_tangible = true;
        }
  
        this.parameter = temp;
    }
  
    addPlace(name, nb_tokens, capacity) {
        const newPlace = new Place(name, nb_tokens, capacity );
  
        this.place.push(newPlace);
        this.nb_place++;
    }
  
    addTransition(name,priority,weight,rate,  rotation) {
        const newTransition = new Transition(name,priority,weight,rate,  rotation);
        this.transition.push(newTransition);
        this.nb_transition++;
    }
    addArc(name, weight, inhibitor,placeTotrans,place,trans) {
        const newArc = new Arc(name, weight, inhibitor,placeTotrans,place,trans);
                this.arc.push(newArc);
        this.nb_arc++;
    }
  
    removeArc(id) {
        this.arc.splice(id, 1);
        this.nb_arc--;
    }
  
   
  
    removePlace(id) {
        for (let i = id; i < this.nb_place-1 ; i++) 
        {
            this.place[i] = this.place[i + 1];
            this.place[i].id_place= i ; // updating the id
        }        
        this.nb_place--;
    }
  
    removeTransition(id) {
        for (let i = id; i < this.nb_transition-1 ; i++) 
        {
            this.transition[i] = this.transition[i + 1];
            this.transition[i].id_transition = i ; // updating the id
        }             this.nb_transition--;
    }
  
    getnb_place() {
        return this.nb_place;
    } 
    conflict(i, j) {
        let conf = false;
        let k = 0;
        while (!conf && k < this.nb_place) {
            if (this.pre[k][i].arc_weight === this.pre[k][j].arc_weight) {
                conf = true;
            }
            k++;
        }
        return conf;
    }
  
    establish_probability() {
        if (this.currant_marking_tangible) {
            for (let i = 0; i < this.enabled_temporary.length; i++) {
                this.transition[this.enabled_temporary[i]].probabibility = this.transition[this.enabled_temporary[i]].getFiring_rate() / this.parameter;
            }
        } else {
            let max = -1;
            for (let i = 0; i < this.nb_immediate_enabled; i++) {
                if (this.enabled_immediate[i][1] === -1) {
                    max++;
                    this.weight_sum[max] = this.transition[this.enabled_immediate[i][0]].weight;
                    this.enabled_immediate[i][1] = max;
                }
                for (let j = i + 1; j < this.nb_immediate_enabled; j++) {
                    if (this.enabled_immediate[j][1] === -1 && this.conflict(this.enabled_immediate[j][0], this.enabled_immediate[i][0])) {
                        this.weight_sum[this.enabled_immediate[i][1]] += this.transition[this.enabled_immediate[j][0]].weight;
                        this.enabled_immediate[j][1] = this.enabled_immediate[i][1]; 
                    }
                }
            }
  
            for (let i = 0; i < this.nb_immediate_enabled; i++) {
                this.transition[this.enabled_immediate[i][0]].probabibility = ((this.transition[this.enabled_immediate[i][0]].weight / this.weight_sum[this.enabled_immediate[i][1]])) / this.weight_sum.length;
              
            }
        }
    }
  
    firing() {
        let min = 0;
        let j = Math.random();
        let i = 0 ; 
        let stop = false ; 
        if (this.currant_marking_tangible) {
            while (!stop && i <this.enabled_temporary.length ) {
              
                    if ( min < j && j <= (this.transition[this.enabled_temporary[i]].probabibility + min )) {
                   stop = true ; 
                   this.transition[this.enabled_temporary[i]].fire();
                    }
                    min = this.transition[this.enabled_temporary[i]].probabibility + min ; 
                    i ++ ; 
            }
        } else {
  
            while (!stop && i <this.nb_immediate_enabled ) {
              
                if ( min < j && j <= (this.transition[this.enabled_immediate[i][0]].probabibility + min )) {
               stop = true ;  
               this.transition[this.enabled_immediate[i][0]].fire();
                }
                min = this.transition[this.enabled_immediate[i][0]].probabibility + min ; 
                i ++ ; 
        }
           
        }
    
    }
  }    
  
  export const PetriNet = new Petri_Net();
  
PetriNet.addTransition();
PetriNet.addPlace();
PetriNet.addArc();
PetriNet.arc[0].Place= PetriNet.place[0];
PetriNet.arc[0].Transition= PetriNet.transition[0];

console.log(PetriNet.transition);
console.log(PetriNet.place);