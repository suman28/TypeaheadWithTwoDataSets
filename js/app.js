$(function () {

    //global variables to store data from both json files
    var items = [];
    var keywords = [];

    $.when(
        //get json from first record
        $.get('../data/data.json', function (data) {
            //store records in items array
            items = data.records;
        }),

        //get json from second record
        $.get('../data/data1.json', function (data) {
            //store records in keywords array
            keywords = data.records;
        })
    ).then(function () {

        var result = {};
        //concat both arrays into one 
        result = items.concat(keywords);
        //now result contains the merged array
        configureItems(result);
    })

    function configureItems(items) {

        //adding value property to each object 
        //materialize-tags expect id values in input field's value
        for (var i in items) {
            if (items.hasOwnProperty(i)) {
                items[i].value = i;
            }
        }

        //bloodhound configuration
        var config = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('NAME', 'KEYWORD'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: $.map(items, function (item, key) {
                //return the object with all 4 properties
                //if some property is undefined set an empty string to it
                return {
                    value: item.value,
                    NAME: item.NAME || '',
                    TBNAME: item.TBNAME || '',
                    KEYWORD: item.KEYWORD || ''
                };
            })
        });

        //initialize config
        config.initialize();

        //configuration for materialize-tags
        var elt = $('input');
        elt.materialtags({

            //itemValue must be set to the name of the property containing the item's value
            itemValue: 'value',

            //set itemText to the name of the property of item to use for a its tag's text.
            itemText: function (item) {
                //if NAME exists, return the same; else return KEYWORD
                if (item) {
                    if (item.NAME) {
                        return item.NAME;
                    } else {
                        return item.KEYWORD;
                    }
                }
            },

            //Classname for the tags, or a function returning a classname
            tagClass: function (item) {
                if (item.KEYWORD) {
                    return 'chip chip_green';
                } else if (item.TBNAME === 'employee') {
                    return 'chip chip_blue';
                } else if (item.TBNAME === 'empdata') {
                    return 'chip chip_maroon';
                } else {
                    return 'chip chip_yellow';
                }
            },
            typeaheadjs: {
                name: 'config',
                displayKey: function (item) {
                    if (item) {
                        if (item.NAME) {
                            return item.NAME;
                        } else {
                            return item.KEYWORD;
                        }
                    }
                },
                source: config.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Unable to find any match',
                        '</div>'
                    ].join('\n'),
                    suggestion: function (data) {

                        //if item has TBNAME property, suggestion should display "NAME" and it's "TBNAME"
                        //if item is a KEYWORD, suggestion should display only it's "KEYWORD"

                        if (data.TBNAME) {
                            var _suggestion = "<div>" +
                                data.NAME +
                                " in " +
                                data.TBNAME + "</div>";
                        } else {
                            var _suggestion = "<div>" +
                                data.KEYWORD + "</div>";
                        }

                        return _suggestion;
                    }
                }
            }
        });
    }


    // var txtinput = document.getElementById("text");
    // var submitButton = document.getElementById("submitBtn");
    // // submitButton.disabled = true;

    // txtinput.addEventListener("click", function() {

    //     if (txtinput.value === "") {
    //         submitButton.disabled = true;
    //     } else {
    //         submitButton.disabled = false;
    //     }
    // });

    $('input').on('itemAdded', function (event) {
        var tag = event.item;
        if (tag.TBNAME === 'systemkeywords') {
            console.log(tag.TBNAME);
            var _chip = document.getElementsByClassName("chip");
        }
        if (tag.TBNAME === 'employee') {
            console.log(tag.TBNAME);
        }
        if (tag.TBNAME === 'empdata') {
            console.log(tag.TBNAME);
        }

    });

    $('input').on('itemRemoved', function (event) {
        var tag = event.item;
        if (tag.TBNAME === 'systemkeywords') {
            console.log(tag.TBNAME);
            var _chip = document.getElementsByClassName("chip");

        }
        if (tag.TBNAME === 'employee') {
            console.log(tag.TBNAME);
        }
        if (tag.TBNAME === 'empdata') {
            console.log(tag.TBNAME);
        }

    });

});