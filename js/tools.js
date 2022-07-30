const pokemonsMainList = document.querySelector('[data-js="pokemons"]')
const fieldsetWrapper = document.querySelector('[data-js="fieldset-wrapper"]')

const createOptions = (optionClicked) => {

    const pokemonsFiltredSection = document.querySelector('[data-js="pokemons-filtered"]')
    const div = document.createElement('div')
    div.setAttribute('data-wrapper-type', optionClicked)

    pokemonsFiltredSection.append(div)

    Array.prototype.forEach.call([...pokemonsMainList.children], (pokemon) => {
        if(pokemon.dataset.type === undefined) {
            return
        }

        switch(pokemon.dataset.type.includes(`${optionClicked}`)) {
            case true:
                pokemon.removeAttribute('style')
                div.insertAdjacentElement('afterbegin', pokemon)
                break
            case false:
                pokemon.style.display = 'none'
                break
        }
    })
}

const updateOptions = (optionClicked) => {
    const pokemonsWrappersTypes = 
        [...document.querySelector(`[data-wrapper-type="${optionClicked}"]`).children]

    pokemonsWrappersTypes.forEach(pokemonFiltred => 
            pokemonsMainList.insertAdjacentElement('afterbegin', pokemonFiltred))

    document.querySelector(`[data-wrapper-type="${optionClicked}"]`)?.remove()

    Array.prototype.forEach.call([...pokemonsMainList.children], pokemon => {
        if(!pokemon.dataset.type.includes(optionClicked)) {
            pokemon.removeAttribute('style')
        }
    })
}

const setupOptionsCheckbox = () => {
    const optionsCheckbox = document.querySelectorAll('[data-input="checkbox"]')
    console.log(optionsCheckbox)

    Array.prototype.forEach.call(optionsCheckbox, (checkboxInput) => {
        checkboxInput.addEventListener('click', event => {
    
            const { checked } = event.target
            const targetDatasetClicked = event.target.dataset
            const { ['option']: optionClicked } = targetDatasetClicked
            console.log(optionClicked)

            switch(checked) {
                case true:
                    createOptions(optionClicked)
                    break
                    
                case false:
                    updateOptions(optionClicked)
                    break
                    
                default:
                    break
            }
        })  
    })
}

export const handleTools = (event, handlePokemonsTypes) => {

    const targetClicked = event.target
    const targetDatasetClicked = targetClicked.dataset
    const { ['checked']: isChecked } = targetClicked
    
    const { tool, target, title } = targetDatasetClicked

    if(isChecked) {
        
        const fieldSet = document.createElement('fieldset')
        fieldSet.setAttribute('data-js', `${tool}-wrapper`)
        fieldSet.setAttribute('data-wrapper', `fieldset-wrappers`)

        const legend = document.createElement('legend')

        legend.textContent = title

        fieldSet.append(legend)

        const ul = document.createElement('ul')
        ul.setAttribute('data-js', 'options')
        fieldSet.append(ul)

        fieldsetWrapper.append(fieldSet)

        switch(tool) {
            case 'filters':
                
                handlePokemonsTypes().then(pokemonsTypes => {

                    const pokemonsTypesLi = pokemonsTypes.map(pokemonType => {
                        
                        const li = document.createElement('li')
                
                        const label = document.createElement('label')
                        label.setAttribute('data-option', pokemonType)
                        label.setAttribute('data-js', 'options-label')
                        li.append(label)
                
                        const input = document.createElement('input')
                        input.setAttribute('type', 'checkbox')
                        input.setAttribute('data-option', pokemonType)
                        input.setAttribute('data-input', 'checkbox')
                        label.append(input)
                
                        const a = document.createElement('a')
                        a.textContent = pokemonType.replace(pokemonType.charAt(0), pokemonType.charAt(0).toUpperCase())
                        label.append(a)
                
                        return li
                
                    })
        
                    pokemonsTypesLi.forEach(li => ul.append(li))
                    setupOptionsCheckbox()
                    
                })

                break
            }
    } else {

        document.querySelector(`[data-js="${tool}-wrapper"]`)?.remove()

    }
}
