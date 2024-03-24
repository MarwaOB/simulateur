import {PetriNet} from "./Petri_Net.js"

class Marking {
    constructor(markin) {
      this.current_marking = markin;
      this.tangible = false;
      this.child_marking = new Array(PetriNet.nb_place).fill(0);
      this.immediate_transition_taken = [];
      this.delayed_transition_taken = [];
      this.probability = new Array(PetriNet.nb_transition).fill(0.0);
      this.sump = [];
      this.blocked_marking = false;
      this.num_enabled_transitions = 0;
      this.id = 0;
      this.parameter = 0;
    }
  
    create_child(i) {
      for (let k = 0; k < PetriNet.nb_place; k++) {
    
  
        this.child_marking[k] = this.current_marking[k] + PetriNet.post[k][i] - PetriNet.pre[k][i].arc_weight;
    }
  
    }
  
    setId(i) {
      this.id = i;
    }
  
    marking_comparison(m) {
      let k = 0;
      let similar = true;
      while (k < PetriNet.nb_place && similar) {
        if (this.child_marking[k] !== m[k]) {
          similar = false;
        }
        k++;
      }
      return similar;
    }
  
    establish_probability() {
      if (this.tangible) {
        for (let i = 0; i < this.delayed_transition_taken.length; i++) {
          this.probability[i] = PetriNet.transition[this.delayed_transition_taken[i]].getFiring_rate() / this.parameter;
        }
      } else {
        let max = -1;
        for (let i = 0; i < this.immediate_transition_taken.length; i++) {
          if (this.immediate_transition_taken[i][1] === -1) {
            max++;
            this.sump[max] = PetriNet.transition[this.immediate_transition_taken[i][0]].weight;
            this.immediate_transition_taken[i][1] = max;
          }
          for (let j = i + 1; j < this.immediate_transition_taken.length; j++) {
            if (this.immediate_transition_taken[j][1] === -1 && PetriNet.conflict(this.immediate_transition_taken[j][0], this.immediate_transition_taken[i][0])) {
              this.sump[this.immediate_transition_taken[i][1]] += PetriNet.transition[this.immediate_transition_taken[j][0]].weight;
              this.immediate_transition_taken[j][1] = this.immediate_transition_taken[i][1];
            }
          }
        }
  
        for (let i = 0; i < this.immediate_transition_taken.length; i++) {
          this.probability[i] = (PetriNet.transition[this.immediate_transition_taken[i][0]].weight / this.sump[this.immediate_transition_taken[i][1]]) / this.sump.length;
        }
      }
    }
  
    enabling() {
      let temp = 0;
      let j = 0;
      let stop_timed = false;
      for (let i = 0; i < PetriNet.nb_transition; i++) {
        if (this.trans_enabling(i)) {
          if (PetriNet.transition[i].getPriority() === 1) {
            this.immediate_transition_taken.push([i, -1]);
            this.num_enabled_transitions++;
            stop_timed = true;
          } else {
            if (!stop_timed) {
              temp += PetriNet.transition[i].getFiring_rate();
              this.delayed_transition_taken[j] = i;
              j++;
            }
          }
        }
      }
      if (j === 0 && this.num_enabled_transitions === 0) {
        PetriNet.blocked = true;
        PetriNet.bounded = true;
      }
      if (this.num_enabled_transitions === 0 && j !== 0) {
        this.tangible = true;
      }
  
      this.parameter = temp;
    }
  
    trans_enabling(j) {
        let enable = true;
        let i = 0;
        while (i < PetriNet.nb_place && enable) {
          
    
            if (!PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight > this.current_marking[i]) {
                enable = false;
            }
            if (PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight <= this.current_marking[i]) {
                enable = false;
            }
            if (PetriNet.post[i][j] + this.current_marking[i] > PetriNet.place[i].capacity) {
                enable = false;
            }
            i++;
        }
   
  
       return enable;
    }
    
  }
  