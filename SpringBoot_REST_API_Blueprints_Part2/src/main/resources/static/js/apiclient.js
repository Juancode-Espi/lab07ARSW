var apiclient=(function(){
    const getBlueprints = (callback) =>{
        $.get("/blueprints",(data)=>{
            callback(data);

        }).fail(()=>{
            alert("Error al intentar buscar autor");
        })
    }

    const getBlueprintsByAuthor = (author,callback) =>{
        $.get("/blueprints/authors/"+author,(data)=>{
            callback(data);

        }).fail(()=>{
            alert("Error al intentar buscar autor");
        })
    }
    const getBlueprintsByNameAndAuthor = (author,name,callback) =>{
        $.get("/blueprints/authors/"+author + "/bpname/"+ name,(data)=>{
            callback(data);

        }).fail(()=>{
            alert("Error al intentar buscar autor y nombre");
        })
    }
    const updateBlueprints = (bp,newPoints) =>{
        //console.log(bp);
        bp.points = newPoints;
        return $.ajax({
            url: "/blueprints/authors/"+bp.author+"/blueprints/"+bp.name,
            type: 'PUT',
            data: JSON.stringify(bp),
            contentType: "application/json"
        });
    }
    return{
        getBlueprintsByAuthor:getBlueprintsByAuthor,
        getBlueprintsByNameAndAuthor:getBlueprintsByNameAndAuthor,
        getBlueprints:getBlueprints,
        updateBlueprints:updateBlueprints
    }

})();