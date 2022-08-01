import { createPokemonWrapper } from './app.js'

const pokemonsMainList = document.querySelector('[data-js="pokemons"]')
const fieldsetWrapper = document.querySelector('[data-js="fieldset-wrapper"]')

const setupOptionsCheckbox = () => {

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

    const optionsCheckbox = document.querySelectorAll('[data-input="checkbox"]')
    
    Array.prototype.forEach.call(optionsCheckbox, (checkboxInput) => {
        checkboxInput.addEventListener('click', event => {
    
            const { checked } = event.target
            const targetDatasetClicked = event.target.dataset
            const { ['option']: optionClicked } = targetDatasetClicked

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

const setupPokemonsTypes = (ul, handlePokemonsTypes) => {
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
    
            const pokemonTypeNameFormatted = 
                pokemonType.replace(
                        pokemonType.charAt(0), 
                        pokemonType.charAt(0).toUpperCase())

            const a = document.createElement('a')
            a.textContent = pokemonTypeNameFormatted
            label.append(a)
    
            return li
    
        })

        pokemonsTypesLi.forEach(li => ul.append(li))
        setupOptionsCheckbox()
        
    })
}

const makeFetchRequest = async (pokemonNameOrID) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrID}`)
    if(!response.ok) {
        return
    }

    const data = await response.json()
    return data

} 

const initializeToolsFieldset = (tool, title, handlePokemonsTypes) => {

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
                setupPokemonsTypes(ul, handlePokemonsTypes)
                break

            case 'findByNameAndID':

                const li = document.createElement('li')

                const input = document.createElement('input')
                input.setAttribute('type', 'text')
                input.setAttribute('data-js', 'pokemonNameOrID')

                const button = document.createElement('input')
                button.setAttribute('type', 'button')
                button.setAttribute('value', 'Search')

                li.append(input, button)

                const reset = document.createElement('input')
                reset.setAttribute('type', 'button')
                reset.setAttribute('value', 'Reset')
                reset.addEventListener('click', () => {

                    const pokemonFiltredSection = document.querySelector('[data-js="pokemons-filtered"]')

                    Array.prototype.forEach.call([...pokemonsMainList.children], (pokemon) => {
                        pokemon.removeAttribute('style')
                    })
                    
                    Array.prototype.forEach.call([...pokemonFiltredSection.children], (pokemon) => {
                        pokemon.remove()
                    })

                    document.querySelectorAll('[data-tool="filters"]')[1].remove('disabled', '')
                    
                })
            
                button.addEventListener('click', async () => {

                    const pokemonFiltredSection = document.querySelector('[data-js="pokemons-filtered"]')

                    const input = document.querySelector('[data-js="pokemonNameOrID"]')
                    const term = input.value.toLowerCase()
                    
                    if(term.match(/[0-9]/g)) {

                        const pokemon = await makeFetchRequest(term)
                        const { name, id } = pokemon

                        const div = document.createElement('div')
                        div.setAttribute('data-pokemon-found', name)
                        
                        const pokemonWrapper = createPokemonWrapper(pokemon.types[0].type.name, id, name, pokemon.sprites.front_default)
                        div.append(pokemonWrapper)

                        pokemonFiltredSection.append(pokemonWrapper)

                        Array.prototype.forEach.call([...pokemonsMainList.children], (pokemon) => {
                            pokemon.style.display = 'none'
                        })

                        document.querySelectorAll('[data-tool="filters"]')[1].setAttribute('disabled', '')
                        li.append(reset)

                    }

                    if(term.match(/[a-zA-Z]/g)) {
                        makeFetchRequest(term).then(pokemon => console.log(pokemon))
                    }
                })

                ul.append(li)

                break

            default:
                break
        }
}

export const handleTools = (event, handlePokemonsTypes) => {

    const targetClicked = event.target
    const targetDatasetClicked = targetClicked.dataset
    const { ['checked']: isChecked } = targetClicked
    
    const { tool, target, title } = targetDatasetClicked

    switch(isChecked) {
        case true:
            initializeToolsFieldset(tool, title, handlePokemonsTypes)
            break

        case false:
            document.querySelector(`[data-js="${tool}-wrapper"]`)?.remove()
            break

        default:
            break        

    }
}
