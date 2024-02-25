import numpy as np

def calcul_imc(poids, taille):
    """
    Calcule l'Indice de Masse Corporelle (IMC) en utilisant le poids (en kg) et la taille (en m).
    
    Args:
        poids (float or numpy.ndarray): Le poids de la personne en kilogrammes.
        taille (float or numpy.ndarray): La taille de la personne en mètres.
        
    Returns:
        float or numpy.ndarray: L'IMC calculé.
    """
    imc = []
    for p, t in zip(poids, taille):
        imc.append(p / (t ** 2))
    return (imc)


def give_bmi(height: list[int | float], weight: list[int | float]) -> list[int | float]:
    poids_array = weight
    taille_array = height
    imc_array = calcul_imc(poids_array, taille_array)
    return (imc_array)
