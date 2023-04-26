let data = fetch("silsilah.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        new OrgChart(document.getElementById("tree"), {
            template: "ana",
            nodeBinding: {
                field_0: "Nama"
            },
            editForm: {
                buttons: null
            },
            nodes: data
        });
    });