from give_bmi import give_bmi

def main():
    from give_bmi import give_bmi
    height = [2.71, 1.15]
    weight = [165.3, 38.4]
    bmi = give_bmi(height, weight)
    print(bmi, type(bmi))

if __name__ == '__main__':
    main()