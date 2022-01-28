


function useState(initialValue) {
    let varr = initialValue;

    function state() {
        return varr;
    }

    function setState(newValue) {
        varr = newValue;
    }

    return [state, setState];
}

const [item, setItem] = useState(10);
