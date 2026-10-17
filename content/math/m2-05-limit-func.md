---
id: limit-func
title: Предел функции, замечательные пределы
level: 2
module: Математический анализ: пределы
hours: 6
prereq: limit-seq
summary: Определение предела функции, односторонние пределы, неопределённости и способы их раскрытия, два замечательных предела, таблица эквивалентностей, символ «о малое».
---

## Определение

:::def Предел функции (по Коши)
$\lim\limits_{x\to a}f(x)=L$, если для любого $\varepsilon>0$ найдётся $\delta>0$ такое, что при $0<|x-a|<\delta$ выполнено $|f(x)-L|<\varepsilon$.
:::

Главное: значение $f(a)$ не важно и может даже не существовать. Предел говорит о поведении функции **рядом** с точкой. Например, $\frac{x^2-4}{x-2}$ не определена при $x=2$, но её предел там равен 4.

Эквивалентное определение (по Гейне): для любой последовательности $x_n\to a$, $x_n\ne a$, выполнено $f(x_n)\to L$.

**Односторонние пределы**: $x\to a-0$ (слева) и $x\to a+0$ (справа). Предел существует, когда оба односторонних существуют и равны. Для $\frac{|x|}x$ в нуле: слева $-1$, справа $1$ — предела нет.

## Неопределённости

Подстановка — первое, что нужно сделать. Если получилось число — это и есть ответ. Если получилось $\frac00$, $\frac\infty\infty$, $\infty-\infty$, $0\cdot\infty$, $1^\infty$, $0^0$, $\infty^0$ — это **неопределённость**: ответ зависит от того, как именно числитель и знаменатель стремятся к своим пределам.

**$\frac00$ у отношения многочленов** — раскладываем на множители и сокращаем:
$$\lim_{x\to1}\frac{x^3-1}{x^2-1}=\lim_{x\to1}\frac{(x-1)(x^2+x+1)}{(x-1)(x+1)}=\frac32.$$

**С корнями** — домножаем на сопряжённое.

## Замечательные пределы

:::thm Первый замечательный предел
$$\lim_{x\to0}\frac{\sin x}{x}=1.$$
:::

Геометрически: для малого угла длина дуги почти совпадает с длиной полухорды. Строго — сравнением площадей треугольников и сектора и теоремой о двух милиционерах.

[[plot sin(x)/x | -15 15 -0.4 1.2]]

:::thm Второй замечательный предел
$$\lim_{x\to0}(1+x)^{1/x}=e,\qquad\lim_{x\to\infty}\left(1+\frac1x\right)^x=e.$$
:::

Он раскрывает неопределённость $1^\infty$. Общая формула: если $u\to1$, $v\to\infty$, то $\lim u^v=e^{\lim(u-1)v}$.

## Эквивалентные бесконечно малые

Функции $\alpha(x)$ и $\beta(x)$ **эквивалентны** при $x\to a$ ($\alpha\sim\beta$), если $\lim\frac\alpha\beta=1$. Из замечательных пределов получается таблица (при $x\to0$):

| | |
|---|---|
| $\sin x\sim x$ | $\tg x\sim x$ |
| $\arcsin x\sim x$ | $\arctg x\sim x$ |
| $1-\cos x\sim\dfrac{x^2}2$ | $\ln(1+x)\sim x$ |
| $e^x-1\sim x$ | $a^x-1\sim x\ln a$ |
| $(1+x)^\alpha-1\sim\alpha x$ | $\sqrt{1+x}-1\sim\dfrac x2$ |

:::thm Замена на эквивалентные
В **произведении и частном** бесконечно малые можно заменять эквивалентными — предел не изменится.
:::

:::example Найдите $\lim\limits_{x\to0}\dfrac{\ln(1+3x)\cdot\sin2x}{(e^{x}-1)\,\tg x}$.
$\frac{3x\cdot2x}{x\cdot x}=6$.
:::

:::warn В сумме заменять нельзя
$\lim\limits_{x\to0}\frac{\tg x-\sin x}{x^3}$. Замена $\tg x\sim x$, $\sin x\sim x$ даёт $\frac0{x^3}=0$ — неверно. Правильно: $\tg x-\sin x=\tg x(1-\cos x)\sim x\cdot\frac{x^2}2$, предел $\frac12$.
:::

## «О малое»

$\alpha=o(\beta)$ при $x\to a$ означает $\frac\alpha\beta\to0$: $\alpha$ стремится к нулю быстрее. Например, $x^2=o(x)$ при $x\to0$. Тогда $\sin x=x+o(x)$ — короткая запись первого замечательного предела. Позже формула Тейлора уточнит: $\sin x=x-\frac{x^3}6+o(x^3)$.

:::formulas
- $\lim\limits_{x\to0}\dfrac{\sin x}x=1$ — первый замечательный предел
- $\lim\limits_{x\to0}(1+x)^{1/x}=e$ — второй замечательный предел
- $\sin x\sim\tg x\sim\arcsin x\sim\arctg x\sim x$ — эквивалентности при $x\to0$
- $1-\cos x\sim\dfrac{x^2}2$ — косинус
- $\ln(1+x)\sim e^x-1\sim x$ — логарифм и экспонента
- $(1+x)^\alpha-1\sim\alpha x$ — степень
- $\lim u^v=e^{\lim(u-1)v}$ при $u\to1,\ v\to\infty$ — неопределённость $1^\infty$
:::

@tasks

@task num 1
Найдите $\displaystyle\lim_{x\to2}\frac{x^2-4}{x-2}$.
@answer 4
@solution
$\frac{(x-2)(x+2)}{x-2}=x+2\to4$.

@task num 1
Найдите $\displaystyle\lim_{x\to0}\frac{\sin3x}{\tg5x}$.
@answer 3/5
@solution
$\frac{3x}{5x}=\frac35$.

@task num 2
Найдите $\displaystyle\lim_{x\to0}\frac{1-\cos4x}{x^2}$.
@answer 8
@solution
$1-\cos4x\sim\frac{(4x)^2}2=8x^2$.

@task num 2
Найдите $\displaystyle\lim_{x\to0}\frac{\ln(1+3x)}{e^{2x}-1}$.
@answer 3/2
@solution
$\frac{3x}{2x}=\frac32$.

@task num 2
Найдите $\displaystyle\lim_{x\to\infty}\left(1+\frac3x\right)^{2x}$.
@answer e^6
@solution
$e^{\lim\frac3x\cdot2x}=e^6$.

@task num 1
Найдите $\displaystyle\lim_{x\to0}\frac{\sqrt{1+x}-1}{x}$.
@answer 1/2
@solution
$\sqrt{1+x}-1\sim\frac x2$.

@task num 2
Найдите $\displaystyle\lim_{x\to+\infty}\left(x-\sqrt{x^2-4x}\right)$.
@answer 2
@solution
$\frac{4x}{x+\sqrt{x^2-4x}}\to\frac42=2$.

@task num 2
Найдите $\displaystyle\lim_{x\to0}(1+\sin x)^{1/x}$.
@answer e
@solution
$e^{\lim\frac{\sin x}x}=e$.

@task num 2
Найдите $\displaystyle\lim_{x\to1}\frac{x^3-1}{x^2-1}$.
@answer 3/2
@solution
См. теорию.

@task num 3
Найдите $\displaystyle\lim_{x\to0}\frac{\tg x-\sin x}{x^3}$.
@answer 1/2
@solution
$\tg x(1-\cos x)\sim x\cdot\frac{x^2}2$.

@task num 3
Найдите $\displaystyle\lim_{x\to0}\frac{\arcsin 2x\cdot(3^x-1)}{x\,\ln(1+x)}$. Ответ запишите через `ln`.
@answer 2ln(3)
@solution
$\frac{2x\cdot x\ln3}{x\cdot x}=2\ln3$.
