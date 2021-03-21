export const layers = {
    namespaced: true,
    state: {
        layers: [],
        selected_layer: null,
        selected_layer_coords: []
    },
    getters: {
        get_layers(state) {
            return state.layers;
        },
        get_selected_layer(state) {
            return state.selected_layer;
        },
        get_selected_layer_coords(state) {
            return state.selected_layer_coords;
        }
    },
    mutations: {
        mut_add_layer(state, layer) {
            state.layers.push(layer);
        },
        mut_set_selected_layer_coords(state, layer) {
            state.selected_layer_coords = layer._latlngs[0].map((objCoordinates) => [
                objCoordinates.lng,
                objCoordinates.lat,
            ]);
        },
        mut_reset_selected_layer_coords(state) {
            state.selected_layer_coords = [];
        },
        mut_delete_layer(state, index) {
            console.log("Deleting layer at index ", index);
            state.layers.splice(index,1);
        }
    },
    actions: {
        act_add_layer({ commit }, layer) {
            commit("mut_add_layer", layer);
            commit("mut_set_selected_layer_coords", layer);
        },
        act_get_selected_layer_coords({ getters, commit }, layer_id) {
            let layers = getters.get_layers;
            let layer = layers.find(layer => layer._leaflet_id == layer_id);
            commit("mut_set_selected_layer_coords", layer);
        },
        act_delete_layers({getters, commit}, layers_ids) {
            let layers = getters.get_layers;
            let index;
            layers_ids.forEach(id => {
                index = layers.findIndex(layer => layer._leaflet_id == id);
                if (index !== -1) {
                    commit("mut_delete_layer", index);
                }
            });
            commit("mut_reset_selected_layer_coords");
        }
    }
}