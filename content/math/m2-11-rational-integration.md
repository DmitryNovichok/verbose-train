---
id: rational-integration
title: Интегрирование рациональных, тригонометрических и иррациональных функций
level: 2
module: Математический анализ: интегралы
hours: 6
prereq: indefinite-integral, polynomials
summary: Разложение рациональной дроби на простейшие, интегрирование простейших дробей, универсальная тригонометрическая подстановка, степени синуса и косинуса, тригонометрические подстановки для корней.
---

## Рациональные дроби

Рациональная функция $\frac{P(x)}{Q(x)}$ всегда интегрируется в элементарных функциях. Алгоритм:

:::algo Интегрирование рациональной дроби
1. Если дробь неправильная ($\deg P\ge\deg Q$) — выделите целую часть делением.
2. Разложите знаменатель на линейные и неразложимые квадратные множители.
3. Представьте правильную дробь суммой простейших с неизвестными коэффициентами.
4. Найдите коэффициенты (приравнивая числители).
5. Проинтегрируйте каждую простейшую дробь.
:::

Каждому множителю знаменателя соответствуют свои слагаемые:

| Множитель | Слагаемые |
|---|---|
| $(x-a)$ | $\dfrac{A}{x-a}$ |
| $(x-a)^k$ | $\dfrac{A_1}{x-a}+\dfrac{A_2}{(x-a)^2}+\dots+\dfrac{A_k}{(x-a)^k}$ |
| $(x^2+px+q)$, $D<0$ | $\dfrac{Bx+C}{x^2+px+q}$ |

:::example Найдите $\int\dfrac{3x+5}{(x+1)(x+3)}\,dx$.
$\frac{3x+5}{(x+1)(x+3)}=\frac A{x+1}+\frac B{x+3}$. Метод «закрывания»: при $x=-1$: $A=\frac{-3+5}{-1+3}=1$; при $x=-3$: $B=\frac{-9+5}{-3+1}=2$.
$$\int\left(\frac1{x+1}+\frac2{x+3}\right)dx=\ln|x+1|+2\ln|x+3|+C.$$
:::

**Квадратный трёхчлен** в знаменателе — выделяем полный квадрат и выделяем в числителе производную знаменателя:

:::example Найдите $\int\dfrac{dx}{x^2+2x+5}$.
$x^2+2x+5=(x+1)^2+4$. $\int\frac{d(x+1)}{(x+1)^2+2^2}=\frac12\arctg\frac{x+1}2+C$.
:::

:::example Найдите $\int\dfrac{2x+3}{x^2+3x+5}\,dx$.
Числитель — производная знаменателя: $\ln(x^2+3x+5)+C$.
:::

## Тригонометрические интегралы

**Произведения** $\sin ax\cos bx$ и т. п. — превращаем в суммы:
$$\sin\alpha\cos\beta=\tfrac12[\sin(\alpha+\beta)+\sin(\alpha-\beta)].$$

**Степени** $\int\sin^mx\cos^nx\,dx$:

- если одна из степеней **нечётная** — отщепляем один множитель под дифференциал: $\sin^3x\,dx=-(1-\cos^2x)\,d(\cos x)$;
- если обе **чётные** — понижаем степень: $\sin^2x=\frac{1-\cos2x}2$.

:::example Найдите $\int\sin^2x\,dx$.
$\int\frac{1-\cos2x}2dx=\frac x2-\frac{\sin2x}4+C$.
:::

**Универсальная подстановка** $t=\tg\frac x2$: $\sin x=\frac{2t}{1+t^2}$, $\cos x=\frac{1-t^2}{1+t^2}$, $dx=\frac{2dt}{1+t^2}$. Сводит любую рациональную функцию от $\sin x$ и $\cos x$ к рациональной дроби от $t$. Работает всегда, но часто громоздко — используйте, когда остальные приёмы не подходят.

## Иррациональности

- $\sqrt[n]{ax+b}$ — замена $t=\sqrt[n]{ax+b}$.
- $\sqrt{a^2-x^2}$ — $x=a\sin t$; $\sqrt{a^2+x^2}$ — $x=a\tg t$; $\sqrt{x^2-a^2}$ — $x=\frac a{\cos t}$.

:::example Найдите $\int\sqrt{1-x^2}\,dx$.
$x=\sin t$, $dx=\cos t\,dt$: $\int\cos^2t\,dt=\frac t2+\frac{\sin2t}4=\frac{\arcsin x+x\sqrt{1-x^2}}{2}+C$. Отсюда, кстати, площадь круга: $4\int_0^1\sqrt{1-x^2}dx=\pi$.
:::

:::formulas
- $\dfrac{P}{Q}=\sum\dfrac{A}{(x-a)^k}+\sum\dfrac{Bx+C}{(x^2+px+q)^m}$ — разложение на простейшие
- $\int\dfrac{dx}{(x+p)^2+a^2}=\dfrac1a\arctg\dfrac{x+p}a+C$ — квадратный трёхчлен
- $t=\tg\dfrac x2:\ \sin x=\dfrac{2t}{1+t^2},\ \cos x=\dfrac{1-t^2}{1+t^2},\ dx=\dfrac{2dt}{1+t^2}$ — универсальная подстановка
- $x=a\sin t$ для $\sqrt{a^2-x^2}$ — тригонометрическая подстановка
:::

@tasks

@task antider 2
Найдите $\int\dfrac{dx}{x^2-1}$ (при $x>1$).
@answer ln((x-1)/(x+1))/2
@range 1.5 4
@solution
$\frac1{x^2-1}=\frac12\left(\frac1{x-1}-\frac1{x+1}\right)$: $\frac12\ln\frac{x-1}{x+1}+C$.

@task antider 1
Найдите $\int\dfrac{2x+3}{x^2+3x+5}\,dx$.
@answer ln(x^2+3x+5)
@solution
Числитель — производная знаменателя.

@task antider 2
Найдите $\int\dfrac{dx}{x(x+1)}$ (при $x>0$).
@answer ln(x/(x+1))
@solution
$\frac1x-\frac1{x+1}$.

@task antider 2
Найдите $\int\dfrac{dx}{x^2+2x+5}$.
@answer arctg((x+1)/2)/2
@solution
См. теорию.

@task antider 1
Найдите $\int\sin^2x\,dx$.
@answer x/2 - sin(2x)/4
@solution
Понижение степени.

@task antider 2
Найдите $\int\sin^3x\,dx$.
@answer -cos(x) + cos(x)^3/3
@solution
$-\int(1-\cos^2x)d(\cos x)=-\cos x+\frac{\cos^3x}{3}+C$.

@task antider 2
Найдите $\int\sin3x\cos x\,dx$.
@answer -cos(4x)/8 - cos(2x)/4
@solution
$\frac12\int(\sin4x+\sin2x)dx=-\frac{\cos4x}8-\frac{\cos2x}4+C$.

@task antider 3
Найдите $\int\sqrt{1-x^2}\,dx$.
@answer (x*sqrt(1-x^2)+arcsin(x))/2
@range -0.9 0.9
@solution
См. теорию.

@task antider 2
Найдите $\int\dfrac{x^3}{x^2+1}\,dx$.
@answer x^2/2 - ln(x^2+1)/2
@solution
$\frac{x^3}{x^2+1}=x-\frac{x}{x^2+1}$.

@task num 2
Разложите $\dfrac{3x+5}{(x+1)(x+3)}=\dfrac{A}{x+1}+\dfrac{B}{x+3}$. Найдите $B$.
@answer 2
@solution
$B=\frac{3\cdot(-3)+5}{-3+1}=2$.

@task antider 3
Найдите $\int\dfrac{dx}{x^2(x+1)}$ (при $x>0$).
@answer -1/x - ln(x) + ln(x+1)
@solution
$\frac{1}{x^2(x+1)}=\frac{A}{x}+\frac{B}{x^2}+\frac{C}{x+1}$: $B=1$, $C=1$, $A=-1$. Интеграл $-\ln x-\frac1x+\ln(x+1)+C$.
