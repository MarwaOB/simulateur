import {PetriNet} from "./Petri_Net.js"

class Marking_graphe {
    constructor() {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
    }

    refreshGraph() {
        var container = document.getElementById("graph-container");

        const graphData = {
            nodes: this.nodes,
            edges: this.edges,
        };

        var options = {
            edges: {
              color : "black",
                arrows: {
                    to: {
                        enabled: true,
                        scaleFactor: 0.5, // Adjust the scaleFactor as needed
                        type: 'arrow',
                    },
                },
            },
            nodes:{
            color : "white",

          },
            physics: {
                enabled: false,
            },
            interaction: {
                zoomView: false,
            },
        };

        const graphOptions = {
            nodes: {
                shape: 'ellipse',
                color: '#ffffff',
            },
            edges: {
               // fontsize: 10,
            },
        };

        var net = new vis.Network(container, graphData, options);
    }

    create_nodes() {
        // Iterate through accessible_marking to create nodes
        for (let i = 0; i < e.accessible_marking.length; i++) {
            const marking = e.accessible_marking[i];
            const nodeId = `Node${i + 1}`;

            // Format the marking information separately
            const markingInfo = `[${marking.current_marking.join(', ')}]`;

            this.nodes.add({ id: nodeId, label: `Marking ${i + 1}: ${markingInfo}` });
        }
    }

    create_edges() {
        // Iterate through the relationship matrix to create edges
        for (let j = 0; j < e.accessible_marking.length; j++) {
            for (let i = 0; i < e.accessible_marking.length; i++) {
                const weight = e.relationship[i][j].weight;
                const transition = e.relationship[i][j].transition;

                if (weight > 0) {
                    this.edges.add({ 
                        from: `Node${j + 1}`, 
                        to: `Node${i + 1}`, 
                        label: ""+ transition +":" + weight,
                        font: {
                            strokeWidth: 0, // Set the stroke width to 0 to remove the stroke
                            size: 16, // Set the font size to make it bigger
                            bold: true, // Set bold to true to make it bold
                        }, });
                }
            }
        }
    }
}