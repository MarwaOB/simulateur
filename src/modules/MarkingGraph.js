import {PetriNet} from "./Petri_Net.js"

class MarkingGraph {
    constructor() {
      this.accessible_marking = [];
      this.to_explore = [];
      this.relationship = []; // Initialize relationship as an empty array
    }
  
    markingGraph() {
      let e = new Marking(PetriNet.initial_marking);
      e.id = 0;
      this.accessible_marking.push(e);
      this.to_explore.push(e);
      let i1 = 0;
      let i2 = 0;
  
      // Initialize relationship array
      for (let i = 0; i < PetriNet.nb_simulation; i++) {
        this.relationship[i] = [];
        for (let j = 0; j < PetriNet.nb_simulation; j++) {
          this.relationship[i][j] = {
            weight: 0,
            transition: '',
          };
        }
      }
  
      while (i2 !== -1 && i1 < PetriNet.nb_simulation) {
        this.to_explore[i2].enabling();
        let mc = this.to_explore[i2];
        i2--;
  
        if (mc.blocked_marking === false) {
          mc.establish_probability();
  
          if (mc.tangible === false) {
            for (let i = 0; i < mc.immediate_transition_taken.length; i++) {
              let index = mc.immediate_transition_taken[i][0];
              mc.create_child(index);
  
              let k = 0;
              let stop = false;
  
              while (k <= i1 && !stop) {
                stop = mc.marking_comparison(this.accessible_marking[k].current_marking);
                k++;
              }
  
              if (stop === true) {
                this.relationship[k - 1][mc.id].weight = mc.probability[i];
                this.relationship[k - 1][mc.id].transition = 'T' + index;
              } else {
                let e = new Marking(mc.child_marking.slice()); // Clone the child marking
i1++;
e.setId(i1);
this.accessible_marking[i1] = e;
i2++;
this.to_explore[i2] = e;
this.relationship[i1][mc.id].weight = mc.probability[i];
this.relationship[i1][mc.id].transition = 'T' + index;
              }
            }
          } else {
            for (let i = 0; i < mc.delayed_transition_taken.length; i++) {
              let index = mc.delayed_transition_taken[i];
              mc.create_child(index);
  
              let k = 0;
              let stop = false;
  
              while (k <= i1 && !stop) {
                stop = mc.marking_comparison(this.accessible_marking[k].current_marking);
                k++;
              }
  
              if (stop === true) {
                this.relationship[k - 1][mc.id].weight = mc.probability[i];
                this.relationship[k - 1][mc.id].transition = 'T' + index;
              } else {
                let e = new Marking(mc.child_marking);
                e.setId(i1);
                i1++;
                this.accessible_marking[i1] = e;
                i2++;
                this.to_explore[i2] = e;
                this.relationship[i1][mc.id].weight = mc.probability[i];
                this.relationship[i1][mc.id].transition = 'T' + index;
              }
            }
          }
        }
      }
    }
  }

